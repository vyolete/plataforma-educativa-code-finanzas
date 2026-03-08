from datetime import datetime, timedelta
from typing import Optional
import uuid
from sqlalchemy.orm import Session
from app.models.user import User
from app.models.invitation import Invitation
from app.utils.security import verify_password, get_password_hash
from app.utils.validators import validate_institutional_email


class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate a user with email and password.
        
        Args:
            email: User's email address
            password: Plain text password
            
        Returns:
            User object if authentication successful, None otherwise
        """
        user = self.db.query(User).filter(User.email == email.lower()).first()
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user
    
    def create_user(
        self,
        email: str,
        password: str,
        full_name: str,
        semester_id: int,
        role: str = "student"
    ) -> User:
        """
        Create a new user.
        
        Args:
            email: User's email address
            password: Plain text password
            full_name: User's full name
            semester_id: ID of the semester the user belongs to
            role: User role ('student' or 'professor')
            
        Returns:
            Created User object
        """
        hashed_password = get_password_hash(password)
        user = User(
            email=email.lower(),
            password_hash=hashed_password,
            full_name=full_name,
            role=role,
            semester_id=semester_id
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get a user by email address.
        
        Args:
            email: User's email address
            
        Returns:
            User object if found, None otherwise
        """
        return self.db.query(User).filter(User.email == email.lower()).first()
    
    def validate_invitation(self, token: str) -> Optional[Invitation]:
        """
        Validate an invitation token.
        
        Args:
            token: Invitation token
            
        Returns:
            Invitation object if valid, None otherwise
        """
        invitation = self.db.query(Invitation).filter(
            Invitation.token == token,
            Invitation.status == "sent"
        ).first()
        
        if not invitation:
            return None
        
        # Check if invitation has expired
        if invitation.expires_at < datetime.utcnow():
            return None
        
        return invitation
    
    def mark_invitation_registered(self, invitation_id: int) -> None:
        """
        Mark an invitation as registered.
        
        Args:
            invitation_id: ID of the invitation
        """
        invitation = self.db.query(Invitation).filter(Invitation.id == invitation_id).first()
        if invitation:
            invitation.status = "registered"
            self.db.commit()
    
    def create_invitation(
        self,
        email: str,
        semester_id: int,
        expires_in_days: int = 30
    ) -> Invitation:
        """
        Create a new invitation.
        
        Args:
            email: Email address to invite
            semester_id: ID of the semester
            expires_in_days: Number of days until invitation expires
            
        Returns:
            Created Invitation object
        """
        token = str(uuid.uuid4())
        expires_at = datetime.utcnow() + timedelta(days=expires_in_days)
        
        invitation = Invitation(
            email=email.lower(),
            semester_id=semester_id,
            token=token,
            status="sent",
            expires_at=expires_at
        )
        self.db.add(invitation)
        self.db.commit()
        self.db.refresh(invitation)
        return invitation
    
    def get_invitations_by_semester(self, semester_id: int):
        """
        Get all invitations for a semester.
        
        Args:
            semester_id: ID of the semester
            
        Returns:
            List of Invitation objects
        """
        return self.db.query(Invitation).filter(
            Invitation.semester_id == semester_id
        ).all()
    
    def resend_invitation(self, invitation_id: int) -> Optional[Invitation]:
        """
        Resend an invitation by updating its expiration date.
        
        Args:
            invitation_id: ID of the invitation
            
        Returns:
            Updated Invitation object if found, None otherwise
        """
        invitation = self.db.query(Invitation).filter(Invitation.id == invitation_id).first()
        if invitation and invitation.status == "sent":
            invitation.expires_at = datetime.utcnow() + timedelta(days=30)
            self.db.commit()
            self.db.refresh(invitation)
            return invitation
        return None
