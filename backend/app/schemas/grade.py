from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class GradeBase(BaseModel):
    trabajo_1: Optional[float] = Field(None, ge=0, le=5, description="Trabajo 1 grade (0-5)")
    trabajo_2: Optional[float] = Field(None, ge=0, le=5, description="Trabajo 2 grade (0-5)")
    concurso: Optional[float] = Field(None, ge=0, le=5, description="Concurso grade (0-5)")
    examen: Optional[float] = Field(None, ge=0, le=5, description="Examen Final grade (0-5)")
    seguimiento: Optional[float] = Field(None, ge=0, le=5, description="Seguimiento grade (0-5)")


class GradeCreate(GradeBase):
    user_id: int
    semester_id: int


class GradeUpdate(GradeBase):
    """Update grade components. Only provided fields will be updated."""
    pass


class GradeResponse(GradeBase):
    id: int
    user_id: int
    semester_id: int
    final_grade: float = Field(description="Calculated final grade (weighted average)")
    updated_at: datetime
    
    class Config:
        from_attributes = True


class GradeWithUser(GradeResponse):
    """Grade response with user information for professor views."""
    user_email: str
    user_name: str
    
    class Config:
        from_attributes = True


class SeguimientoCalculation(BaseModel):
    """Breakdown of seguimiento calculation."""
    exercises_score: float = Field(description="Score from exercises completed (40%)")
    activity_score: float = Field(description="Score from code activity (30%)")
    participation_score: float = Field(description="Score from participation (20%)")
    module_score: float = Field(description="Score from module progress (10%)")
    total_seguimiento: float = Field(description="Total seguimiento grade (0-5)")
