from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.team import TeamMember
from app.schemas.submission import (
    ProjectSubmissionCreate,
    ProjectSubmissionResponse,
    ProjectSubmissionUpdate,
    ProjectSubmissionWithConfirmations
)
from app.services.submission_service import SubmissionService
from app.services.cloudinary_service import CloudinaryService
from app.utils.security import get_current_user, get_current_professor
from datetime import datetime


router = APIRouter()


@router.post("/", response_model=ProjectSubmissionResponse)
async def create_submission(
    team_id: int = Form(...),
    semester_id: int = Form(...),
    submission_type: str = Form(...),
    due_date: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new project submission.
    Uploads notebook to Cloudinary and creates submission record.
    """
    # Validate submission_type
    valid_types = ['trabajo_1', 'trabajo_2', 'concurso', 'examen']
    if submission_type not in valid_types:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid submission_type. Must be one of: {', '.join(valid_types)}"
        )
    
    # Parse due_date
    try:
        due_date_obj = datetime.fromisoformat(due_date.replace('Z', '+00:00'))
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid due_date format. Use ISO format (YYYY-MM-DDTHH:MM:SS)"
        )
    
    # Validate notebook content
    cloudinary_service = CloudinaryService()
    validation = await cloudinary_service.validate_notebook_content(file)
    
    if not validation["valid"]:
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Notebook validation failed",
                "errors": validation["errors"]
            }
        )
    
    # Upload to Cloudinary
    try:
        upload_result = await cloudinary_service.upload_notebook(
            file=file,
            team_id=team_id,
            submission_type=submission_type
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload notebook: {str(e)}"
        )
    
    # Create submission
    submission_service = SubmissionService(db)
    submission_data = ProjectSubmissionCreate(
        team_id=team_id,
        semester_id=semester_id,
        submission_type=submission_type,
        notebook_url=upload_result["url"],
        due_date=due_date_obj
    )
    
    submission = submission_service.create_submission(
        submission_data=submission_data,
        user_id=current_user.id
    )
    
    return submission


@router.post("/{submission_id}/confirm", response_model=ProjectSubmissionResponse)
def confirm_submission(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirm a submission as a team member.
    When all team members confirm, status changes to 'confirmed'.
    """
    submission_service = SubmissionService(db)
    
    # Confirm submission
    submission_service.confirm_submission(
        submission_id=submission_id,
        user_id=current_user.id
    )
    
    # Return updated submission
    submission = submission_service.get_submission_by_id(submission_id)
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return submission


@router.get("/team/{team_id}", response_model=List[ProjectSubmissionWithConfirmations])
def get_team_submissions(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all submissions for a team.
    Returns submissions with confirmation status.
    """
    submission_service = SubmissionService(db)
    submissions = submission_service.get_team_submissions(
        team_id=team_id,
        user_id=current_user.id
    )
    
    # Enrich with confirmation data
    result = []
    for submission in submissions:
        # Count team members
        team_members_count = db.query(TeamMember).filter(
            TeamMember.team_id == team_id
        ).count()
        
        # Count confirmations
        confirmations_count = len(submission.confirmations)
        
        submission_dict = {
            **submission.__dict__,
            "total_confirmations": confirmations_count,
            "required_confirmations": team_members_count,
            "is_fully_confirmed": confirmations_count >= team_members_count
        }
        
        result.append(submission_dict)
    
    return result


@router.put("/{submission_id}/grade", response_model=ProjectSubmissionResponse)
def grade_submission(
    submission_id: int,
    grade: float = Form(...),
    feedback: str = Form(None),
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Grade a submission (professor only).
    Updates status to 'graded' and stores grade and feedback.
    """
    # Validate grade range
    if grade < 0 or grade > 5:
        raise HTTPException(
            status_code=400,
            detail="Grade must be between 0 and 5"
        )
    
    submission_service = SubmissionService(db)
    submission = submission_service.grade_submission(
        submission_id=submission_id,
        grade=grade,
        feedback=feedback
    )
    
    return submission


@router.get("/semester/{semester_id}", response_model=List[ProjectSubmissionResponse])
def get_semester_submissions(
    semester_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Get all submissions for a semester (professor only).
    """
    submission_service = SubmissionService(db)
    submissions = submission_service.get_all_submissions_by_semester(semester_id)
    
    return submissions


@router.get("/{submission_id}", response_model=ProjectSubmissionWithConfirmations)
def get_submission(
    submission_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific submission by ID.
    """
    submission_service = SubmissionService(db)
    submission = submission_service.get_submission_by_id(submission_id)
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Verify user has access (team member or professor)
    if current_user.role != "professor":
        team_member = db.query(TeamMember).filter(
            TeamMember.team_id == submission.team_id,
            TeamMember.user_id == current_user.id
        ).first()
        
        if not team_member:
            raise HTTPException(
                status_code=403,
                detail="You don't have access to this submission"
            )
    
    # Count team members and confirmations
    team_members_count = db.query(TeamMember).filter(
        TeamMember.team_id == submission.team_id
    ).count()
    
    confirmations_count = len(submission.confirmations)
    
    return {
        **submission.__dict__,
        "total_confirmations": confirmations_count,
        "required_confirmations": team_members_count,
        "is_fully_confirmed": confirmations_count >= team_members_count
    }
