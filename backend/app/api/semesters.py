from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.schemas.semester import (
    SemesterCreate,
    SemesterUpdate,
    SemesterResponse,
    DueDateResponse,
    SemesterWithDueDates
)
from app.services.semester_service import SemesterService
from app.utils.security import get_current_professor, get_current_user

router = APIRouter()


@router.post("", response_model=SemesterResponse, status_code=status.HTTP_201_CREATED)
async def create_semester(
    semester_data: SemesterCreate,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Create a new semester (professors only).
    
    Requirements validated:
    - 33.1: Professor can create semester with start and end dates
    - 33.2: Automatically calculates duration in weeks
    - 33.3: Validates duration is between 15-20 weeks
    """
    semester_service = SemesterService(db)
    
    try:
        semester = semester_service.create_semester(semester_data)
        return semester
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("", response_model=List[SemesterResponse])
async def get_semesters(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all semesters.
    
    Requirements validated:
    - 33.12: Students see only their semester
    - 33.13: Professors can view all semesters
    """
    semester_service = SemesterService(db)
    
    if current_user.role == 'professor':
        # Professors can see all semesters (Requirement 33.13)
        semesters = semester_service.get_all_semesters()
    else:
        # Students see only their semester (Requirement 33.12)
        if current_user.semester_id:
            semester = semester_service.get_semester_by_id(current_user.semester_id)
            semesters = [semester] if semester else []
        else:
            semesters = []
    
    return semesters


@router.get("/active", response_model=SemesterResponse)
async def get_active_semester(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the currently active semester.
    
    Requirements validated:
    - 33.6: Only one active semester at a time
    """
    semester_service = SemesterService(db)
    semester = semester_service.get_active_semester()
    
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active semester found"
        )
    
    return semester


@router.get("/{semester_id}", response_model=SemesterResponse)
async def get_semester(
    semester_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific semester by ID.
    
    Requirements validated:
    - 33.12: Students can only access their semester
    - 33.13: Professors can access any semester
    """
    semester_service = SemesterService(db)
    semester = semester_service.get_semester_by_id(semester_id)
    
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Semester not found"
        )
    
    # Students can only access their own semester
    if current_user.role == 'student' and current_user.semester_id != semester_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own semester"
        )
    
    return semester


@router.get("/{semester_id}/due-dates", response_model=DueDateResponse)
async def get_semester_due_dates(
    semester_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calculate and return delivery dates for a semester.
    
    Requirements validated:
    - 33.5: Calculates delivery dates automatically
    - 33.14: Trabajo_1 week 6, Trabajo_2 week 11, Concurso week 15, Examen_Final week 17
    - 33.15: Adjusts proportionally if duration differs from 17 weeks
    """
    semester_service = SemesterService(db)
    
    # Verify semester exists
    semester = semester_service.get_semester_by_id(semester_id)
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Semester not found"
        )
    
    # Students can only access their own semester
    if current_user.role == 'student' and current_user.semester_id != semester_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own semester"
        )
    
    due_dates = semester_service.calculate_due_dates(semester_id)
    return due_dates


@router.put("/{semester_id}", response_model=SemesterResponse)
async def update_semester(
    semester_id: int,
    semester_data: SemesterUpdate,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Update semester information (professors only).
    """
    semester_service = SemesterService(db)
    
    try:
        semester = semester_service.update_semester(semester_id, semester_data)
        if not semester:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Semester not found"
            )
        return semester
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{semester_id}/archive", response_model=SemesterResponse)
async def archive_semester(
    semester_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Archive a semester (professors only).
    
    Requirements validated:
    - 33.8: Professor can archive a semester
    - 33.9: Maintains all historical data
    - 33.10: Prevents new activities in archived semester
    """
    semester_service = SemesterService(db)
    semester = semester_service.archive_semester(semester_id)
    
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Semester not found"
        )
    
    return semester


@router.post("/{semester_id}/activate", response_model=SemesterResponse)
async def activate_semester(
    semester_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Set a semester as active, deactivating all others (professors only).
    
    Requirements validated:
    - 33.6: Mark semester as active
    - 33.7: Only one active semester at a time
    """
    semester_service = SemesterService(db)
    semester = semester_service.set_active_semester(semester_id)
    
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Semester not found"
        )
    
    return semester


@router.delete("/{semester_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_semester(
    semester_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Delete a semester (professors only).
    
    Note: This should only be used for semesters with no associated data.
    Use archive instead for semesters with students/teams/submissions.
    """
    semester_service = SemesterService(db)
    semester = semester_service.get_semester_by_id(semester_id)
    
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Semester not found"
        )
    
    # Check if semester has associated data
    if semester.users or semester.teams or semester.invitations:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete semester with associated data. Use archive instead."
        )
    
    db.delete(semester)
    db.commit()
    
    return None
