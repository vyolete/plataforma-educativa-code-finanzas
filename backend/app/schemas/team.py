from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class TeamMemberBase(BaseModel):
    user_id: int


class TeamMemberResponse(BaseModel):
    id: int
    team_id: int
    user_id: int
    joined_at: datetime
    
    class Config:
        from_attributes = True


class TeamMemberWithUser(BaseModel):
    id: int
    user_id: int
    email: str
    full_name: str
    joined_at: datetime
    
    class Config:
        from_attributes = True


class TeamBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)


class TeamCreate(TeamBase):
    semester_id: int


class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    repository_url: Optional[str] = None


class TeamResponse(BaseModel):
    id: int
    name: str
    semester_id: int
    repository_url: Optional[str] = None
    leader_id: int
    created_at: datetime
    member_count: Optional[int] = None
    
    class Config:
        from_attributes = True


class TeamDetailResponse(TeamResponse):
    members: List[TeamMemberWithUser] = []
    
    class Config:
        from_attributes = True


class TeamInviteRequest(BaseModel):
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@correo\.itm\.edu\.co$")


class TeamInviteResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[int] = None


class TeamRepositoryUpdate(BaseModel):
    """Request to link a repository to a team."""
    repository_url: str = Field(..., min_length=1)


class TeamRepositoryResponse(BaseModel):
    """Response after linking/unlinking repository."""
    success: bool
    message: str
    repository_url: Optional[str] = None
    repository_info: Optional['RepositoryInfo'] = None
    
    class Config:
        from_attributes = True


# Import RepositoryInfo for type hint
from app.schemas.github import RepositoryInfo
TeamRepositoryResponse.model_rebuild()
