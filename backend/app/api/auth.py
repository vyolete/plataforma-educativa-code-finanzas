from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserResponse, Token
from app.services.auth_service import AuthService
from app.utils.security import create_access_token, get_current_user
from app.utils.validators import validate_institutional_email, validate_password_strength
from app.config import settings
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    """
    Register a new user with an invitation token.
    
    Requirements validated:
    - 1.1: Validates institutional email (@correo.itm.edu.co)
    - 1.2: Rejects non-institutional emails
    - 2.6: Allows registration with valid invitation token
    - 2.7: Validates invitation is for correct semester
    """
    auth_service = AuthService(db)
    
    # Validate institutional email (Requirement 1.1, 1.2)
    if not validate_institutional_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only @correo.itm.edu.co emails are allowed"
        )
    
    # Validate password strength
    is_valid, error_msg = validate_password_strength(user_data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=error_msg
        )
    
    # Validate invitation token (Requirement 2.6)
    invitation = auth_service.validate_invitation(user_data.invitation_token)
    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired invitation token"
        )
    
    # Verify email matches invitation (Requirement 2.7)
    if invitation.email.lower() != user_data.email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email does not match invitation"
        )
    
    # Check if user already exists
    existing_user = auth_service.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user = auth_service.create_user(
        email=user_data.email,
        password=user_data.password,
        full_name=user_data.full_name,
        semester_id=invitation.semester_id,
        role="student"
    )
    
    # Mark invitation as registered (Requirement 2.10)
    auth_service.mark_invitation_registered(invitation.id)
    
    return user


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """
    Login with email and password, returns JWT token.
    
    Requirements validated:
    - 1.2: Authenticates with institutional email
    - 1.3: Returns JWT token with 7-day expiration
    """
    auth_service = AuthService(db)
    
    # Authenticate user
    user = auth_service.authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token (Requirement 1.3 - 7 day expiration)
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role},
        expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
):
    """
    Get current authenticated user information.
    
    Requirements validated:
    - 1.3: Returns user info for authenticated user
    """
    return current_user


@router.post("/logout")
async def logout():
    """
    Logout endpoint (client-side token removal).
    
    Note: JWT tokens are stateless, so logout is handled client-side
    by removing the token from storage.
    """
    return {"message": "Successfully logged out"}


from fastapi import UploadFile, File
from app.schemas.invitation import (
    InvitationResponse,
    InvitationStatus,
    CSVUploadResponse,
    BulkInvitationResponse
)
from app.services.email_service import EmailService
from app.utils.security import get_current_professor
from app.utils.validators import validate_csv_emails
from app.models.semester import Semester
from app.models.invitation import Invitation
from typing import List


from app.schemas.github import (
    GitHubConnectRequest,
    GitHubConnectResponse,
    GitHubStatusResponse,
    GitHubDisconnectResponse
)


@router.post("/github/connect", response_model=GitHubConnectResponse)
async def connect_github(
    request: GitHubConnectRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Connect GitHub account using OAuth authorization code.
    
    Requirements validated:
    - 8.1: Student can connect GitHub account via OAuth
    - 8.2: Store access token securely (encrypted)
    """
    from app.services.github_service import GitHubService
    
    github_service = GitHubService()
    
    # Exchange code for access token
    access_token = await github_service.exchange_code_for_token(request.code)
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to exchange authorization code for access token"
        )
    
    # Get GitHub user info to verify token
    user_info = await github_service.get_user_info(access_token)
    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to retrieve GitHub user information"
        )
    
    # Encrypt and store token (Requirement 8.2)
    encrypted_token = github_service.encrypt_token(access_token)
    current_user.github_token = encrypted_token
    
    db.commit()
    db.refresh(current_user)
    
    return GitHubConnectResponse(
        success=True,
        message="GitHub account connected successfully",
        github_username=user_info.get("login"),
        github_name=user_info.get("name")
    )


@router.post("/github/disconnect", response_model=GitHubDisconnectResponse)
async def disconnect_github(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Disconnect GitHub account.
    
    Requirements validated:
    - 8.6: Student can disconnect GitHub account anytime
    """
    if not current_user.github_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No GitHub account connected"
        )
    
    # Remove token from database
    current_user.github_token = None
    db.commit()
    
    return GitHubDisconnectResponse(
        success=True,
        message="GitHub account disconnected successfully"
    )


@router.get("/github/status", response_model=GitHubStatusResponse)
async def get_github_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Check if user has GitHub account connected.
    """
    from app.services.github_service import GitHubService
    
    if not current_user.github_token:
        return GitHubStatusResponse(
            connected=False,
            github_username=None
        )
    
    # Decrypt token and get user info
    github_service = GitHubService()
    try:
        access_token = github_service.decrypt_token(current_user.github_token)
        user_info = await github_service.get_user_info(access_token)
        
        if user_info:
            return GitHubStatusResponse(
                connected=True,
                github_username=user_info.get("login"),
                github_name=user_info.get("name"),
                github_avatar=user_info.get("avatar_url")
            )
        else:
            # Token is invalid, remove it
            current_user.github_token = None
            db.commit()
            return GitHubStatusResponse(
                connected=False,
                github_username=None
            )
    except Exception as e:
        # Token decryption failed, remove it
        current_user.github_token = None
        db.commit()
        return GitHubStatusResponse(
            connected=False,
            github_username=None
        )


@router.post("/invite", response_model=BulkInvitationResponse)
async def send_invitations(
    csv_file: UploadFile = File(...),
    semester_id: int = None,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Upload CSV file with emails and send invitations (professors only).
    
    Requirements validated:
    - 2.1: Professor can upload CSV with authorized emails
    - 2.2: Validates each email is institutional
    - 2.3: Shows error report for invalid emails
    - 2.4: Generates unique invitation token for each email
    - 2.5: Sends invitation email to each valid address
    """
    auth_service = AuthService(db)
    email_service = EmailService()
    
    # Verify semester exists
    semester = db.query(Semester).filter(Semester.id == semester_id).first()
    if not semester:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Semester not found"
        )
    
    # Read CSV content
    content = await csv_file.read()
    csv_content = content.decode('utf-8')
    
    # Validate emails (Requirement 2.2, 2.3)
    valid_emails, errors = validate_csv_emails(csv_content)
    
    if not valid_emails:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid emails found in CSV",
            headers={"X-Validation-Errors": str(errors)}
        )
    
    # Create invitations and send emails
    results = []
    invitations_data = []
    
    for email in valid_emails:
        # Check if user already exists
        existing_user = auth_service.get_user_by_email(email)
        if existing_user:
            results.append({
                "email": email,
                "status": "failed",
                "reason": "User already registered"
            })
            continue
        
        # Check if invitation already exists
        existing_invitation = db.query(Invitation).filter(
            Invitation.email == email.lower(),
            Invitation.semester_id == semester_id,
            Invitation.status == "sent"
        ).first()
        
        if existing_invitation:
            results.append({
                "email": email,
                "status": "failed",
                "reason": "Invitation already sent"
            })
            continue
        
        # Create invitation (Requirement 2.4)
        invitation = auth_service.create_invitation(email, semester_id)
        invitations_data.append((email, invitation.token, semester.name))
        
        results.append({
            "email": email,
            "status": "pending",
            "token": invitation.token
        })
    
    # Send emails in bulk (Requirement 2.5)
    email_results = await email_service.send_bulk_invitations(invitations_data)
    
    # Update results with email sending status
    for result in results:
        if result["status"] == "pending":
            result["status"] = "sent"
    
    return {
        "invitations_sent": email_results["success"],
        "invitations_failed": email_results["failed"] + len([r for r in results if r["status"] == "failed"]),
        "total": len(valid_emails),
        "details": results
    }


@router.get("/invitations/{semester_id}", response_model=List[InvitationStatus])
async def get_semester_invitations(
    semester_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Get all invitations for a semester (professors only).
    
    Requirements validated:
    - 2.8: Professor can view invitation status for each student
    """
    auth_service = AuthService(db)
    invitations = auth_service.get_invitations_by_semester(semester_id)
    
    return [
        {
            "email": inv.email,
            "status": inv.status,
            "created_at": inv.created_at,
            "expires_at": inv.expires_at
        }
        for inv in invitations
    ]


@router.post("/invitations/{invitation_id}/resend")
async def resend_invitation(
    invitation_id: int,
    current_user: User = Depends(get_current_professor),
    db: Session = Depends(get_db)
):
    """
    Resend an invitation (professors only).
    
    Requirements validated:
    - 2.9: Professor can resend invitations to pending students
    """
    auth_service = AuthService(db)
    email_service = EmailService()
    
    # Get invitation
    invitation = db.query(Invitation).filter(Invitation.id == invitation_id).first()
    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invitation not found"
        )
    
    # Check if invitation is in sent status
    if invitation.status != "sent":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Can only resend invitations with 'sent' status"
        )
    
    # Update expiration date
    updated_invitation = auth_service.resend_invitation(invitation_id)
    if not updated_invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update invitation"
        )
    
    # Get semester info
    semester = db.query(Semester).filter(Semester.id == invitation.semester_id).first()
    
    # Resend email
    await email_service.send_invitation_email(
        invitation.email,
        invitation.token,
        semester.name
    )
    
    return {
        "message": "Invitation resent successfully",
        "email": invitation.email,
        "new_expiration": updated_invitation.expires_at
    }


@router.get("/validate-invitation/{token}")
async def validate_invitation_token(
    token: str,
    db: Session = Depends(get_db)
):
    """
    Validate an invitation token (public endpoint).
    
    This endpoint allows the frontend to check if a token is valid
    before showing the registration form.
    """
    auth_service = AuthService(db)
    invitation = auth_service.validate_invitation(token)
    
    if not invitation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired invitation token"
        )
    
    # Get semester info
    semester = db.query(Semester).filter(Semester.id == invitation.semester_id).first()
    
    return {
        "valid": True,
        "email": invitation.email,
        "semester_name": semester.name if semester else "Unknown",
        "expires_at": invitation.expires_at
    }
