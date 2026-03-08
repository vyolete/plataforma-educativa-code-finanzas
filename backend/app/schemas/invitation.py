from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime


class InvitationCreate(BaseModel):
    email: EmailStr
    semester_id: int


class InvitationBulkCreate(BaseModel):
    semester_id: int
    emails: List[EmailStr]


class InvitationResponse(BaseModel):
    id: int
    email: str
    semester_id: int
    token: str
    status: str
    created_at: datetime
    expires_at: datetime
    
    class Config:
        from_attributes = True


class InvitationStatus(BaseModel):
    email: str
    status: str
    created_at: datetime
    expires_at: datetime


class CSVUploadResponse(BaseModel):
    valid_emails: List[str]
    invalid_emails: List[dict]
    total_valid: int
    total_invalid: int


class BulkInvitationResponse(BaseModel):
    invitations_sent: int
    invitations_failed: int
    total: int
    details: List[dict]
