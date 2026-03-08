"""
Pydantic schemas for GitHub OAuth integration.
"""

from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class GitHubConnectRequest(BaseModel):
    """Request to connect GitHub account with OAuth code."""
    code: str


class GitHubConnectResponse(BaseModel):
    """Response after connecting GitHub account."""
    success: bool
    message: str
    github_username: Optional[str] = None
    github_name: Optional[str] = None


class GitHubStatusResponse(BaseModel):
    """Response for GitHub connection status."""
    connected: bool
    github_username: Optional[str] = None
    github_name: Optional[str] = None
    github_avatar: Optional[str] = None


class GitHubDisconnectResponse(BaseModel):
    """Response after disconnecting GitHub account."""
    success: bool
    message: str


class RepositoryValidationRequest(BaseModel):
    """Request to validate repository access."""
    repository_url: str


class RepositoryInfo(BaseModel):
    """GitHub repository information."""
    name: str
    full_name: str
    description: Optional[str] = None
    private: bool
    url: str
    stars: int
    forks: int
    language: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class RepositoryValidationResponse(BaseModel):
    """Response for repository validation."""
    valid: bool
    repository_info: Optional[RepositoryInfo] = None
    error_message: Optional[str] = None
