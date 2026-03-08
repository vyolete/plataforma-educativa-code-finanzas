from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import date, datetime


class SemesterBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="Semester name (e.g., '2024-1')")
    start_date: date = Field(..., description="Semester start date")
    end_date: date = Field(..., description="Semester end date")


class SemesterCreate(SemesterBase):
    @field_validator('end_date')
    @classmethod
    def validate_end_date(cls, v, info):
        if 'start_date' in info.data and v <= info.data['start_date']:
            raise ValueError('end_date must be after start_date')
        return v


class SemesterUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = Field(None, pattern='^(active|archived)$')


class SemesterResponse(SemesterBase):
    id: int
    status: str
    duration_weeks: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class DueDateResponse(BaseModel):
    trabajo_1: date
    trabajo_2: date
    concurso: date
    examen_final: date
    
    class Config:
        from_attributes = True


class SemesterWithDueDates(SemesterResponse):
    due_dates: DueDateResponse
