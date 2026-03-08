from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.exercise import Exercise, ExerciseSubmission
from app.models.user import User
from app.schemas.exercise import (
    ExerciseResponse,
    ExerciseSubmissionCreate,
    ExerciseSubmissionResponse,
    HintRequest
)
from app.utils.security import get_current_user

router = APIRouter()


@router.get("/module/{module_id}", response_model=List[ExerciseResponse])
async def get_exercises_by_module(
    module_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all exercises for a specific module.
    
    Args:
        module_id: ID of the module
        db: Database session
        current_user: Authenticated user
        
    Returns:
        List of exercises for the module
    """
    exercises = db.query(Exercise).filter(
        Exercise.module_id == module_id
    ).all()
    
    return exercises


@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific exercise by ID.
    
    Args:
        exercise_id: ID of the exercise
        db: Database session
        current_user: Authenticated user
        
    Returns:
        Exercise details
        
    Raises:
        HTTPException: If exercise not found
    """
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exercise with id {exercise_id} not found"
        )
    
    return exercise


@router.post("/{exercise_id}/submit", response_model=ExerciseSubmissionResponse)
async def submit_exercise(
    exercise_id: int,
    submission: ExerciseSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit a solution for an exercise.
    
    This endpoint creates a submission record. The actual validation
    happens on the frontend using Pyodide.
    
    Args:
        exercise_id: ID of the exercise
        submission: Submission data with code
        db: Database session
        current_user: Authenticated user
        
    Returns:
        Created submission
        
    Raises:
        HTTPException: If exercise not found
    """
    # Verify exercise exists
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exercise with id {exercise_id} not found"
        )
    
    # Create submission with pending status
    # Status will be updated by frontend after validation
    new_submission = ExerciseSubmission(
        exercise_id=exercise_id,
        user_id=current_user.id,
        code=submission.code,
        status="pending"
    )
    
    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)
    
    return new_submission


@router.put("/{exercise_id}/submit/{submission_id}", response_model=ExerciseSubmissionResponse)
async def update_submission_result(
    exercise_id: int,
    submission_id: int,
    status: str,
    output: str = None,
    execution_time_ms: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update submission result after validation.
    
    Called by frontend after running tests in Pyodide.
    
    Args:
        exercise_id: ID of the exercise
        submission_id: ID of the submission
        status: Result status (correct, incorrect, pending)
        output: Execution output
        execution_time_ms: Execution time in milliseconds
        db: Database session
        current_user: Authenticated user
        
    Returns:
        Updated submission
        
    Raises:
        HTTPException: If submission not found or unauthorized
    """
    submission = db.query(ExerciseSubmission).filter(
        ExerciseSubmission.id == submission_id,
        ExerciseSubmission.exercise_id == exercise_id,
        ExerciseSubmission.user_id == current_user.id
    ).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found or unauthorized"
        )
    
    # Update submission
    submission.status = status
    if output:
        submission.output = output
    if execution_time_ms:
        submission.execution_time_ms = execution_time_ms
    
    db.commit()
    db.refresh(submission)
    
    # If correct, update student progress
    if status == "correct":
        from app.models.progress import StudentProgress
        
        # Get exercise module
        exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
        
        # Check if this is the first correct submission for this exercise
        previous_correct = db.query(ExerciseSubmission).filter(
            ExerciseSubmission.exercise_id == exercise_id,
            ExerciseSubmission.user_id == current_user.id,
            ExerciseSubmission.status == "correct",
            ExerciseSubmission.id != submission_id
        ).first()
        
        if not previous_correct:
            # Update progress
            progress = db.query(StudentProgress).filter(
                StudentProgress.user_id == current_user.id,
                StudentProgress.module_id == exercise.module_id
            ).first()
            
            if progress:
                progress.exercises_completed += 1
            else:
                # Create progress record
                progress = StudentProgress(
                    user_id=current_user.id,
                    module_id=exercise.module_id,
                    exercises_completed=1,
                    exercises_total=db.query(Exercise).filter(
                        Exercise.module_id == exercise.module_id
                    ).count()
                )
                db.add(progress)
            
            db.commit()
    
    return submission


@router.post("/{exercise_id}/hints/track")
async def track_hint_usage(
    exercise_id: int,
    hint_request: HintRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Track when a student uses a hint.
    
    This helps professors understand which exercises are challenging
    and allows tracking hint usage in student progress.
    
    Args:
        exercise_id: ID of the exercise
        hint_request: Hint level used
        db: Database session
        current_user: Authenticated user
        
    Returns:
        Confirmation message
        
    Raises:
        HTTPException: If exercise not found or invalid hint level
    """
    if hint_request.hint_level < 1 or hint_request.hint_level > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hint level must be between 1 and 3"
        )
    
    # Verify exercise exists
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exercise with id {exercise_id} not found"
        )
    
    # Track hint usage in student progress
    from app.models.progress import HintUsage
    from datetime import datetime
    
    hint_usage = HintUsage(
        user_id=current_user.id,
        exercise_id=exercise_id,
        hint_level=hint_request.hint_level,
        used_at=datetime.utcnow()
    )
    
    db.add(hint_usage)
    db.commit()
    
    return {
        "message": "Hint usage tracked successfully",
        "exercise_id": exercise_id,
        "hint_level": hint_request.hint_level,
        "user_id": current_user.id
    }


@router.get("/{exercise_id}/hints")
async def get_exercise_hints(
    exercise_id: int,
    hint_level: int = 1,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get progressive hints for an exercise.
    
    Args:
        exercise_id: ID of the exercise
        hint_level: Hint level (1-3)
        db: Database session
        current_user: Authenticated user
        
    Returns:
        Hints up to the requested level
        
    Raises:
        HTTPException: If exercise not found or invalid hint level
    """
    if hint_level < 1 or hint_level > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hint level must be between 1 and 3"
        )
    
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    
    if not exercise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exercise with id {exercise_id} not found"
        )
    
    if not exercise.hints:
        return {"hints": [], "message": "No hints available for this exercise"}
    
    # Return hints up to the requested level
    hints = exercise.hints[:hint_level] if isinstance(exercise.hints, list) else []
    
    return {
        "exercise_id": exercise_id,
        "hint_level": hint_level,
        "hints": hints,
        "total_hints": len(exercise.hints) if isinstance(exercise.hints, list) else 0
    }


@router.get("/{exercise_id}/submissions", response_model=List[ExerciseSubmissionResponse])
async def get_user_submissions(
    exercise_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all submissions for an exercise by the current user.
    
    Args:
        exercise_id: ID of the exercise
        db: Database session
        current_user: Authenticated user
        
    Returns:
        List of user's submissions for the exercise
    """
    submissions = db.query(ExerciseSubmission).filter(
        ExerciseSubmission.exercise_id == exercise_id,
        ExerciseSubmission.user_id == current_user.id
    ).order_by(ExerciseSubmission.submitted_at.desc()).all()
    
    return submissions
