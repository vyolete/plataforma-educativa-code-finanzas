"""
Progress tracking API endpoints.
Handles student progress, module completion, and code activity tracking.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.progress import StudentProgress, CodeActivity
from app.schemas.progress import (
    OverallProgressResponse,
    ModuleProgressResponse,
    StudentProgressResponse,
    CodeActivityCreate,
    CodeActivityResponse
)
from app.utils.security import get_current_user

router = APIRouter()

# Module names mapping (8 modules as per requirements)
MODULE_NAMES = {
    1: "Introducción a Python",
    2: "Estructuras de Control",
    3: "Funciones y Módulos",
    4: "Estructuras de Datos",
    5: "Pandas y Análisis de Datos",
    6: "Visualización con Matplotlib",
    7: "Análisis Financiero",
    8: "Proyecto Final"
}


@router.get("/me", response_model=OverallProgressResponse)
async def get_my_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's overall progress across all modules.
    Returns total exercises completed, module-by-module progress,
    and recent code activity.
    """
    # Get progress for all modules
    progress_records = db.query(StudentProgress).filter(
        StudentProgress.user_id == current_user.id
    ).all()
    
    # Build module progress list
    modules_progress = []
    total_exercises_completed = 0
    total_exercises = 0
    
    for module_id in range(1, 9):  # 8 modules
        # Find existing progress record
        progress = next(
            (p for p in progress_records if p.module_id == module_id),
            None
        )
        
        if progress:
            exercises_completed = progress.exercises_completed
            exercises_total = progress.exercises_total
            last_activity = progress.last_activity
        else:
            # Default values for modules without progress
            exercises_completed = 0
            exercises_total = 10  # Default exercises per module
            last_activity = None
        
        modules_progress.append(ModuleProgressResponse(
            module_id=module_id,
            module_name=MODULE_NAMES.get(module_id, f"Módulo {module_id}"),
            exercises_completed=exercises_completed,
            exercises_total=exercises_total,
            last_activity=last_activity
        ))
        
        total_exercises_completed += exercises_completed
        total_exercises += exercises_total
    
    # Get recent code activity (last 10)
    recent_activities = db.query(CodeActivity).filter(
        CodeActivity.user_id == current_user.id
    ).order_by(desc(CodeActivity.last_executed)).limit(10).all()
    
    recent_activity = [
        CodeActivityResponse(
            id=activity.id,
            user_id=activity.user_id,
            code_snippet=activity.code_snippet,
            execution_count=activity.execution_count,
            last_executed=activity.last_executed
        )
        for activity in recent_activities
    ]
    
    # Get total code executions
    total_executions = db.query(
        func.sum(CodeActivity.execution_count)
    ).filter(
        CodeActivity.user_id == current_user.id
    ).scalar() or 0
    
    return OverallProgressResponse(
        total_exercises_completed=total_exercises_completed,
        total_exercises=total_exercises,
        modules_progress=modules_progress,
        recent_activity=recent_activity,
        total_code_executions=int(total_executions)
    )


@router.get("/module/{module_id}", response_model=StudentProgressResponse)
async def get_module_progress(
    module_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get progress for a specific module.
    Creates a new progress record if one doesn't exist.
    """
    # Validate module_id
    if module_id < 1 or module_id > 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid module_id. Must be between 1 and 8."
        )
    
    # Get or create progress record
    progress = db.query(StudentProgress).filter(
        StudentProgress.user_id == current_user.id,
        StudentProgress.module_id == module_id
    ).first()
    
    if not progress:
        # Create new progress record
        progress = StudentProgress(
            user_id=current_user.id,
            module_id=module_id,
            exercises_completed=0,
            exercises_total=10,  # Default exercises per module
            last_activity=datetime.utcnow()
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)
    
    return StudentProgressResponse(
        id=progress.id,
        user_id=progress.user_id,
        module_id=progress.module_id,
        exercises_completed=progress.exercises_completed,
        exercises_total=progress.exercises_total,
        last_activity=progress.last_activity
    )


@router.post("/activity", response_model=CodeActivityResponse)
async def register_code_activity(
    activity_data: CodeActivityCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Register a code execution activity.
    Creates a new activity record or updates existing one if the same code
    snippet was executed before.
    """
    # Check if this code snippet was executed before
    existing_activity = db.query(CodeActivity).filter(
        CodeActivity.user_id == current_user.id,
        CodeActivity.code_snippet == activity_data.code_snippet
    ).first()
    
    if existing_activity:
        # Update existing activity
        existing_activity.execution_count += activity_data.execution_count
        existing_activity.last_executed = datetime.utcnow()
        db.commit()
        db.refresh(existing_activity)
        
        return CodeActivityResponse(
            id=existing_activity.id,
            user_id=existing_activity.user_id,
            code_snippet=existing_activity.code_snippet,
            execution_count=existing_activity.execution_count,
            last_executed=existing_activity.last_executed
        )
    else:
        # Create new activity record
        new_activity = CodeActivity(
            user_id=current_user.id,
            code_snippet=activity_data.code_snippet,
            execution_count=activity_data.execution_count,
            last_executed=datetime.utcnow()
        )
        db.add(new_activity)
        db.commit()
        db.refresh(new_activity)
        
        return CodeActivityResponse(
            id=new_activity.id,
            user_id=new_activity.user_id,
            code_snippet=new_activity.code_snippet,
            execution_count=new_activity.execution_count,
            last_executed=new_activity.last_executed
        )
