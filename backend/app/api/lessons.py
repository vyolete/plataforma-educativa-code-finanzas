from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from typing import List
from app.database import get_db
from app.models.lesson import Lesson, LessonContent, LessonObjective
from app.schemas.lesson import (
    LessonResponse,
    LessonDetailResponse,
    LessonCreate,
    LessonUpdate
)

router = APIRouter()


@router.get("/lessons", response_model=List[LessonResponse])
async def get_all_lessons(
    db: Session = Depends(get_db)
):
    """
    Get all lessons with basic information.
    
    Returns lessons ordered by module_id and order_index.
    """
    try:
        lessons = db.query(Lesson).order_by(
            Lesson.module_id,
            Lesson.order_index
        ).all()
        
        return lessons
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching lessons: {str(e)}"
        )


@router.get("/lessons/module/{module_id}", response_model=List[LessonResponse])
async def get_lessons_by_module(
    module_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all lessons for a specific module.
    
    Args:
        module_id: ID of the module to fetch lessons for
        
    Returns:
        List of lessons ordered by order_index
        
    Raises:
        404: If no lessons found for the module
    """
    try:
        lessons = db.query(Lesson).filter(
            Lesson.module_id == module_id
        ).order_by(Lesson.order_index).all()
        
        if not lessons:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No lessons found for module {module_id}"
            )
        
        return lessons
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching lessons for module {module_id}: {str(e)}"
        )


@router.get("/lessons/{lesson_id}", response_model=LessonDetailResponse)
async def get_lesson_detail(
    lesson_id: int,
    db: Session = Depends(get_db)
):
    """
    Get full lesson details including content blocks, objectives, and prerequisites.
    
    Args:
        lesson_id: ID of the lesson to fetch
        
    Returns:
        Detailed lesson information with related content
        
    Raises:
        404: If lesson not found
    """
    try:
        # Fetch lesson with eager loading of relationships
        lesson = db.query(Lesson).options(
            joinedload(Lesson.content_blocks),
            joinedload(Lesson.objectives)
        ).filter(Lesson.id == lesson_id).first()
        
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lesson {lesson_id} not found"
            )
        
        # Sort content blocks and objectives by their order fields
        if lesson.content_blocks:
            lesson.content_blocks.sort(key=lambda x: x.content_order)
        if lesson.objectives:
            lesson.objectives.sort(key=lambda x: x.objective_order)
        
        return lesson
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching lesson {lesson_id}: {str(e)}"
        )


@router.post("/lessons", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
async def create_lesson(
    lesson: LessonCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new lesson.
    
    Args:
        lesson: Lesson data to create
        
    Returns:
        Created lesson
        
    Raises:
        400: If validation fails
    """
    try:
        db_lesson = Lesson(**lesson.dict())
        db.add(db_lesson)
        db.commit()
        db.refresh(db_lesson)
        
        return db_lesson
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error creating lesson: {str(e)}"
        )


@router.put("/lessons/{lesson_id}", response_model=LessonResponse)
async def update_lesson(
    lesson_id: int,
    lesson_update: LessonUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing lesson.
    
    Args:
        lesson_id: ID of the lesson to update
        lesson_update: Fields to update
        
    Returns:
        Updated lesson
        
    Raises:
        404: If lesson not found
    """
    try:
        db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        
        if not db_lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lesson {lesson_id} not found"
            )
        
        # Update only provided fields
        update_data = lesson_update.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_lesson, field, value)
        
        db.commit()
        db.refresh(db_lesson)
        
        return db_lesson
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error updating lesson {lesson_id}: {str(e)}"
        )


@router.delete("/lessons/{lesson_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_lesson(
    lesson_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a lesson.
    
    Args:
        lesson_id: ID of the lesson to delete
        
    Raises:
        404: If lesson not found
    """
    try:
        db_lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        
        if not db_lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lesson {lesson_id} not found"
            )
        
        db.delete(db_lesson)
        db.commit()
        
        return None
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error deleting lesson {lesson_id}: {str(e)}"
        )
