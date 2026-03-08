from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class SubmissionConfirmationBase(BaseModel):
    submission_id: int
    user_id: int


class SubmissionConfirmationCreate(SubmissionConfirmationBase):
    pass


class SubmissionConfirmationResponse(SubmissionConfirmationBase):
    id: int
    confirmed_at: datetime
    
    class Config:
        from_attributes = True


class ProjectSubmissionBase(BaseModel):
    submission_type: str = Field(..., pattern="^(trabajo_1|trabajo_2|concurso|examen)$")
    notebook_url: str


class ProjectSubmissionCreate(ProjectSubmissionBase):
    team_id: int
    semester_id: int
    due_date: datetime


class ProjectSubmissionUpdate(BaseModel):
    status: Optional[str] = Field(None, pattern="^(pending|confirmed|graded)$")
    grade: Optional[Decimal] = Field(None, ge=0, le=5)
    feedback: Optional[str] = None


class ProjectSubmissionResponse(ProjectSubmissionBase):
    id: int
    team_id: int
    semester_id: int
    status: str
    grade: Optional[Decimal] = None
    feedback: Optional[str] = None
    submitted_at: datetime
    due_date: datetime
    is_late: bool
    confirmations: List[SubmissionConfirmationResponse] = []
    
    class Config:
        from_attributes = True


class ProjectSubmissionWithConfirmations(ProjectSubmissionResponse):
    """Extended response with confirmation details"""
    total_confirmations: int
    required_confirmations: int
    is_fully_confirmed: bool
