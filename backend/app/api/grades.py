from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.grade import Grade
from app.schemas.grade import GradeResponse, GradeUpdate, GradeWithUser
from app.services.grading_service import GradingService
from app.utils.security import get_current_user, get_current_professor
import csv
from io import StringIO
from fastapi.responses import StreamingResponse

router = APIRouter()


@router.get("/me", response_model=GradeResponse)
async def get_my_grades(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's grades.
    Students can only see their own grades.
    """
    if not current_user.semester_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not enrolled in a semester"
        )
    
    grading_service = GradingService(db)
    grade = grading_service.get_user_grade(current_user.id, current_user.semester_id)
    
    if not grade:
        # Create empty grade record
        grade = grading_service.get_or_create_grade(current_user.id, current_user.semester_id)
    
    # Calculate final grade
    final_grade = grade.calculate_final_grade()
    
    return GradeResponse(
        id=grade.id,
        user_id=grade.user_id,
        semester_id=grade.semester_id,
        trabajo_1=grade.trabajo_1,
        trabajo_2=grade.trabajo_2,
        concurso=grade.concurso,
        examen=grade.examen,
        seguimiento=grade.seguimiento,
        final_grade=final_grade,
        updated_at=grade.updated_at
    )


@router.put("/{user_id}", response_model=GradeResponse)
async def update_user_grades(
    user_id: int,
    grade_update: GradeUpdate,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Update grades for a specific user.
    Only professors can update grades.
    """
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.semester_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not enrolled in a semester"
        )
    
    # Update grades
    grading_service = GradingService(db)
    grade = grading_service.update_grade(
        user_id=user_id,
        semester_id=user.semester_id,
        trabajo_1=grade_update.trabajo_1,
        trabajo_2=grade_update.trabajo_2,
        concurso=grade_update.concurso,
        examen=grade_update.examen,
        seguimiento=grade_update.seguimiento
    )
    
    final_grade = grade.calculate_final_grade()
    
    return GradeResponse(
        id=grade.id,
        user_id=grade.user_id,
        semester_id=grade.semester_id,
        trabajo_1=grade.trabajo_1,
        trabajo_2=grade.trabajo_2,
        concurso=grade.concurso,
        examen=grade.examen,
        seguimiento=grade.seguimiento,
        final_grade=final_grade,
        updated_at=grade.updated_at
    )


@router.get("/semester/{semester_id}", response_model=List[GradeWithUser])
async def get_semester_grades(
    semester_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Get all grades for a semester.
    Only professors can access this endpoint.
    """
    grading_service = GradingService(db)
    grades = grading_service.get_semester_grades(semester_id)
    
    # Build response with user information
    result = []
    for grade in grades:
        user = db.query(User).filter(User.id == grade.user_id).first()
        if user:
            final_grade = grade.calculate_final_grade()
            result.append(GradeWithUser(
                id=grade.id,
                user_id=grade.user_id,
                semester_id=grade.semester_id,
                trabajo_1=grade.trabajo_1,
                trabajo_2=grade.trabajo_2,
                concurso=grade.concurso,
                examen=grade.examen,
                seguimiento=grade.seguimiento,
                final_grade=final_grade,
                updated_at=grade.updated_at,
                user_email=user.email,
                user_name=user.full_name
            ))
    
    return result


@router.post("/calculate-seguimiento/{user_id}", response_model=GradeResponse)
async def recalculate_seguimiento(
    user_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Recalculate seguimiento for a specific user.
    Only professors can trigger this calculation.
    """
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    if not user.semester_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not enrolled in a semester"
        )
    
    # Recalculate seguimiento
    grading_service = GradingService(db)
    grade = grading_service.recalculate_seguimiento(user_id, user.semester_id)
    
    final_grade = grade.calculate_final_grade()
    
    return GradeResponse(
        id=grade.id,
        user_id=grade.user_id,
        semester_id=grade.semester_id,
        trabajo_1=grade.trabajo_1,
        trabajo_2=grade.trabajo_2,
        concurso=grade.concurso,
        examen=grade.examen,
        seguimiento=grade.seguimiento,
        final_grade=final_grade,
        updated_at=grade.updated_at
    )


@router.post("/calculate-seguimiento/semester/{semester_id}")
async def recalculate_semester_seguimiento(
    semester_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Recalculate seguimiento for all users in a semester.
    Only professors can trigger this calculation.
    """
    # Get all users in the semester
    users = db.query(User).filter(
        User.semester_id == semester_id,
        User.role == "student"
    ).all()
    
    grading_service = GradingService(db)
    updated_count = 0
    
    for user in users:
        try:
            grading_service.recalculate_seguimiento(user.id, semester_id)
            updated_count += 1
        except Exception as e:
            # Log error but continue with other users
            print(f"Error calculating seguimiento for user {user.id}: {str(e)}")
    
    return {
        "message": f"Seguimiento recalculated for {updated_count} students",
        "total_students": len(users),
        "updated": updated_count
    }


@router.get("/export/semester/{semester_id}")
async def export_semester_grades(
    semester_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Export all grades for a semester as CSV.
    Only professors can export grades.
    """
    grading_service = GradingService(db)
    grades = grading_service.get_semester_grades(semester_id)
    
    # Create CSV in memory
    output = StringIO()
    writer = csv.writer(output)
    
    # Write header
    writer.writerow([
        "Email",
        "Nombre",
        "Trabajo 1",
        "Trabajo 2",
        "Concurso",
        "Examen Final",
        "Seguimiento",
        "Nota Final"
    ])
    
    # Write data
    for grade in grades:
        user = db.query(User).filter(User.id == grade.user_id).first()
        if user:
            final_grade = grade.calculate_final_grade()
            writer.writerow([
                user.email,
                user.full_name,
                grade.trabajo_1 or "",
                grade.trabajo_2 or "",
                grade.concurso or "",
                grade.examen or "",
                grade.seguimiento or "",
                final_grade
            ])
    
    # Prepare response
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename=grades_semester_{semester_id}.csv"
        }
    )
