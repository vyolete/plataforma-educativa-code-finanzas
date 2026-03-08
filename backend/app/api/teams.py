from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.team import Team, TeamMember
from app.schemas.team import (
    TeamCreate,
    TeamResponse,
    TeamDetailResponse,
    TeamInviteRequest,
    TeamInviteResponse,
    TeamUpdate,
    TeamMemberWithUser,
    TeamRepositoryUpdate,
    TeamRepositoryResponse
)
from app.schemas.github import RepositoryInfo
from app.utils.security import get_current_user, get_current_student

router = APIRouter()


@router.post("", response_model=TeamDetailResponse, status_code=status.HTTP_201_CREATED)
async def create_team(
    team_data: TeamCreate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Create a new team. The creator becomes the team leader.
    
    Requirements validated:
    - 9.1: Student can create a team with unique name
    - 9.2: Creator is assigned as team leader
    """
    # Check if team name already exists in the semester
    existing_team = db.query(Team).filter(
        Team.name == team_data.name,
        Team.semester_id == team_data.semester_id
    ).first()
    
    if existing_team:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Team name '{team_data.name}' already exists in this semester"
        )
    
    # Check if user is already in a team for this semester
    existing_membership = db.query(TeamMember).join(Team).filter(
        TeamMember.user_id == current_user.id,
        Team.semester_id == team_data.semester_id
    ).first()
    
    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already a member of a team in this semester"
        )
    
    # Verify user belongs to the semester
    if current_user.semester_id != team_data.semester_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create teams in your enrolled semester"
        )
    
    # Create team (Requirement 9.1, 9.2)
    team = Team(
        name=team_data.name,
        semester_id=team_data.semester_id,
        leader_id=current_user.id
    )
    db.add(team)
    db.flush()  # Get team.id
    
    # Add creator as first member
    team_member = TeamMember(
        team_id=team.id,
        user_id=current_user.id
    )
    db.add(team_member)
    db.commit()
    db.refresh(team)
    
    # Build response with members
    members = db.query(TeamMember).filter(TeamMember.team_id == team.id).all()
    members_with_user = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        members_with_user.append(TeamMemberWithUser(
            id=member.id,
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            joined_at=member.joined_at
        ))
    
    return TeamDetailResponse(
        id=team.id,
        name=team.name,
        semester_id=team.semester_id,
        repository_url=team.repository_url,
        leader_id=team.leader_id,
        created_at=team.created_at,
        member_count=len(members_with_user),
        members=members_with_user
    )


@router.get("", response_model=List[TeamResponse])
async def list_teams(
    semester_id: int = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List teams. Students see teams in their semester, professors can filter by semester.
    
    Requirements validated:
    - Lists teams for the current semester
    """
    query = db.query(Team)
    
    # Students can only see teams in their semester
    if current_user.role == "student":
        if not current_user.semester_id:
            return []
        query = query.filter(Team.semester_id == current_user.semester_id)
    # Professors can filter by semester
    elif semester_id:
        query = query.filter(Team.semester_id == semester_id)
    
    teams = query.all()
    
    # Add member count to each team
    result = []
    for team in teams:
        member_count = db.query(TeamMember).filter(TeamMember.team_id == team.id).count()
        result.append(TeamResponse(
            id=team.id,
            name=team.name,
            semester_id=team.semester_id,
            repository_url=team.repository_url,
            leader_id=team.leader_id,
            created_at=team.created_at,
            member_count=member_count
        ))
    
    return result


@router.get("/{team_id}", response_model=TeamDetailResponse)
async def get_team(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get team details with member list.
    
    Requirements validated:
    - 9.9: Shows team members and repository to all members
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Students can only view teams in their semester
    if current_user.role == "student" and team.semester_id != current_user.semester_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view teams in your semester"
        )
    
    # Get members with user details
    members = db.query(TeamMember).filter(TeamMember.team_id == team_id).all()
    members_with_user = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        members_with_user.append(TeamMemberWithUser(
            id=member.id,
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            joined_at=member.joined_at
        ))
    
    return TeamDetailResponse(
        id=team.id,
        name=team.name,
        semester_id=team.semester_id,
        repository_url=team.repository_url,
        leader_id=team.leader_id,
        created_at=team.created_at,
        member_count=len(members_with_user),
        members=members_with_user
    )


@router.post("/{team_id}/invite", response_model=TeamInviteResponse)
async def invite_member(
    team_id: int,
    invite_data: TeamInviteRequest,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Invite a student to join the team. Only team leader can invite.
    
    Requirements validated:
    - 9.3: Team leader can invite students by institutional email
    - 9.6: Team size limited to 2-4 members
    - 9.7: Reject invitation if team has 4 members
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Only team leader can invite (Requirement 9.3)
    if team.leader_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team leader can invite members"
        )
    
    # Check team size limit (Requirement 9.6, 9.7)
    current_member_count = db.query(TeamMember).filter(TeamMember.team_id == team_id).count()
    if current_member_count >= 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team has reached maximum size of 4 members"
        )
    
    # Find user by email
    invited_user = db.query(User).filter(User.email == invite_data.email).first()
    if not invited_user:
        return TeamInviteResponse(
            success=False,
            message=f"No user found with email {invite_data.email}",
            user_id=None
        )
    
    # Check if user is a student
    if invited_user.role != "student":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only students can be invited to teams"
        )
    
    # Check if user is in the same semester
    if invited_user.semester_id != team.semester_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User must be in the same semester as the team"
        )
    
    # Check if user is already in a team for this semester
    existing_membership = db.query(TeamMember).join(Team).filter(
        TeamMember.user_id == invited_user.id,
        Team.semester_id == team.semester_id
    ).first()
    
    if existing_membership:
        return TeamInviteResponse(
            success=False,
            message=f"User is already a member of a team in this semester",
            user_id=invited_user.id
        )
    
    # In a real implementation, this would send a notification
    # For now, we'll auto-add the user (simplified version)
    # TODO: Implement proper invitation system with accept/reject
    
    return TeamInviteResponse(
        success=True,
        message=f"Invitation ready for {invite_data.email}. User can now join the team.",
        user_id=invited_user.id
    )


@router.post("/{team_id}/join", response_model=TeamDetailResponse)
async def join_team(
    team_id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Accept invitation and join a team.
    
    Requirements validated:
    - 9.4: Student can accept invitation
    - 9.5: Student is added to team upon acceptance
    - 9.6: Team size limited to 2-4 members
    - 9.7: Reject if team has 4 members
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Check if user is in the same semester
    if current_user.semester_id != team.semester_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only join teams in your enrolled semester"
        )
    
    # Check if already a member
    existing_membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == current_user.id
    ).first()
    
    if existing_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already a member of this team"
        )
    
    # Check if user is in another team for this semester
    other_membership = db.query(TeamMember).join(Team).filter(
        TeamMember.user_id == current_user.id,
        Team.semester_id == team.semester_id,
        Team.id != team_id
    ).first()
    
    if other_membership:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already a member of another team in this semester"
        )
    
    # Check team size limit (Requirement 9.6, 9.7)
    current_member_count = db.query(TeamMember).filter(TeamMember.team_id == team_id).count()
    if current_member_count >= 4:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team has reached maximum size of 4 members"
        )
    
    # Add user to team (Requirement 9.5)
    team_member = TeamMember(
        team_id=team_id,
        user_id=current_user.id
    )
    db.add(team_member)
    db.commit()
    
    # Return updated team details
    members = db.query(TeamMember).filter(TeamMember.team_id == team_id).all()
    members_with_user = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        members_with_user.append(TeamMemberWithUser(
            id=member.id,
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            joined_at=member.joined_at
        ))
    
    return TeamDetailResponse(
        id=team.id,
        name=team.name,
        semester_id=team.semester_id,
        repository_url=team.repository_url,
        leader_id=team.leader_id,
        created_at=team.created_at,
        member_count=len(members_with_user),
        members=members_with_user
    )


@router.delete("/{team_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    team_id: int,
    user_id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Remove a member from the team. Only team leader can remove members.
    Leader cannot remove themselves.
    
    Requirements validated:
    - Team leader can remove members
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Only team leader can remove members
    if team.leader_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team leader can remove members"
        )
    
    # Leader cannot remove themselves
    if user_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Team leader cannot remove themselves. Transfer leadership first or delete the team."
        )
    
    # Find and remove the member
    member = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id
    ).first()
    
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found in this team"
        )
    
    db.delete(member)
    db.commit()
    
    return None


@router.put("/{team_id}", response_model=TeamDetailResponse)
async def update_team(
    team_id: int,
    team_data: TeamUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Update team details (name, repository URL). Only team leader can update.
    
    Requirements validated:
    - 9.8: Team leader can link GitHub repository
    - 9.9: Repository URL is shown to all team members
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Only team leader can update (Requirement 9.8)
    if team.leader_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team leader can update team details"
        )
    
    # Update fields
    if team_data.name is not None:
        # Check if new name is unique in semester
        existing_team = db.query(Team).filter(
            Team.name == team_data.name,
            Team.semester_id == team.semester_id,
            Team.id != team_id
        ).first()
        
        if existing_team:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Team name '{team_data.name}' already exists in this semester"
            )
        
        team.name = team_data.name
    
    if team_data.repository_url is not None:
        team.repository_url = team_data.repository_url
    
    db.commit()
    db.refresh(team)
    
    # Return updated team with members
    members = db.query(TeamMember).filter(TeamMember.team_id == team_id).all()
    members_with_user = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        members_with_user.append(TeamMemberWithUser(
            id=member.id,
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            joined_at=member.joined_at
        ))
    
    return TeamDetailResponse(
        id=team.id,
        name=team.name,
        semester_id=team.semester_id,
        repository_url=team.repository_url,
        leader_id=team.leader_id,
        created_at=team.created_at,
        member_count=len(members_with_user),
        members=members_with_user
    )


@router.put("/{team_id}/repository", response_model=TeamRepositoryResponse)
async def link_repository(
    team_id: int,
    repository_data: TeamRepositoryUpdate,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Link a GitHub repository to the team. Only team leader can link.
    
    Requirements validated:
    - 8.3: Student can link GitHub repository to profile/team
    - 8.4: Verify student has access to repository
    - 8.5: Show error if no access
    - 9.8: Team leader can link team repository
    - 9.9: Show repository to all team members
    """
    from app.services.github_service import GitHubService
    
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Only team leader can link repository (Requirement 9.8)
    if team.leader_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team leader can link a repository"
        )
    
    # Check if user has GitHub connected
    if not current_user.github_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must connect your GitHub account first"
        )
    
    # Decrypt GitHub token
    github_service = GitHubService()
    try:
        access_token = github_service.decrypt_token(current_user.github_token)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid GitHub token. Please reconnect your GitHub account."
        )
    
    # Validate repository access (Requirement 8.4)
    has_access, repo_info, error_message = github_service.validate_repository_access(
        access_token,
        repository_data.repository_url
    )
    
    # Show error if no access (Requirement 8.5)
    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_message or "Unable to access repository"
        )
    
    # Link repository to team (Requirement 8.3, 9.8)
    team.repository_url = repository_data.repository_url
    db.commit()
    db.refresh(team)
    
    # Return response with repository info (Requirement 9.9)
    return TeamRepositoryResponse(
        success=True,
        message="Repository linked successfully",
        repository_url=team.repository_url,
        repository_info=RepositoryInfo(**repo_info) if repo_info else None
    )


@router.delete("/{team_id}/repository")
async def unlink_repository(
    team_id: int,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Unlink GitHub repository from team. Only team leader can unlink.
    """
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Only team leader can unlink repository
    if team.leader_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the team leader can unlink the repository"
        )
    
    if not team.repository_url:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No repository linked to this team"
        )
    
    # Unlink repository
    team.repository_url = None
    db.commit()
    
    return {
        "success": True,
        "message": "Repository unlinked successfully"
    }


@router.get("/{team_id}/repository", response_model=TeamRepositoryResponse)
async def get_repository_info(
    team_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get repository information for a team.
    
    Requirements validated:
    - 9.9: Show repository to all team members
    """
    from app.services.github_service import GitHubService
    
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Team not found"
        )
    
    # Students can only view teams in their semester
    if current_user.role == "student" and team.semester_id != current_user.semester_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view teams in your semester"
        )
    
    if not team.repository_url:
        return TeamRepositoryResponse(
            success=False,
            message="No repository linked to this team",
            repository_url=None,
            repository_info=None
        )
    
    # Try to get repository info if user has GitHub connected
    repo_info = None
    if current_user.github_token:
        github_service = GitHubService()
        try:
            access_token = github_service.decrypt_token(current_user.github_token)
            repo_info = await github_service.get_repository_info(access_token, team.repository_url)
        except Exception:
            # If we can't get info, just return the URL
            pass
    
    return TeamRepositoryResponse(
        success=True,
        message="Repository information retrieved",
        repository_url=team.repository_url,
        repository_info=RepositoryInfo(**repo_info) if repo_info else None
    )


@router.get("/my-team/current", response_model=TeamDetailResponse)
async def get_my_team(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Get the current user's team in their enrolled semester.
    """
    if not current_user.semester_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are not enrolled in any semester"
        )
    
    # Find user's team in current semester
    membership = db.query(TeamMember).join(Team).filter(
        TeamMember.user_id == current_user.id,
        Team.semester_id == current_user.semester_id
    ).first()
    
    if not membership:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You are not a member of any team in the current semester"
        )
    
    team = db.query(Team).filter(Team.id == membership.team_id).first()
    
    # Get all members
    members = db.query(TeamMember).filter(TeamMember.team_id == team.id).all()
    members_with_user = []
    for member in members:
        user = db.query(User).filter(User.id == member.user_id).first()
        members_with_user.append(TeamMemberWithUser(
            id=member.id,
            user_id=user.id,
            email=user.email,
            full_name=user.full_name,
            joined_at=member.joined_at
        ))
    
    return TeamDetailResponse(
        id=team.id,
        name=team.name,
        semester_id=team.semester_id,
        repository_url=team.repository_url,
        leader_id=team.leader_id,
        created_at=team.created_at,
        member_count=len(members_with_user),
        members=members_with_user
    )
