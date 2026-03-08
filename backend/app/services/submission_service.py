from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.submission import ProjectSubmission, SubmissionConfirmation
from app.models.team import Team, TeamMember
from app.schemas.submission import ProjectSubmissionCreate, ProjectSubmissionUpdate
from app.utils.notebook_validator import NotebookValidator
from datetime import datetime
from typing import List, Optional, Dict, Any
from fastapi import HTTPException


class SubmissionService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_submission(
        self,
        submission_data: ProjectSubmissionCreate,
        user_id: int
    ) -> ProjectSubmission:
        """
        Create a new project submission.
        Validates that the user is a member of the team.
        """
        # Verify user is member of the team
        team_member = self.db.query(TeamMember).filter(
            and_(
                TeamMember.team_id == submission_data.team_id,
                TeamMember.user_id == user_id
            )
        ).first()
        
        if not team_member:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of this team"
            )
        
        # Check if submission already exists for this type
        existing = self.db.query(ProjectSubmission).filter(
            and_(
                ProjectSubmission.team_id == submission_data.team_id,
                ProjectSubmission.submission_type == submission_data.submission_type,
                ProjectSubmission.semester_id == submission_data.semester_id
            )
        ).first()
        
        if existing:
            raise HTTPException(
                status_code=400,
                detail=f"Submission for {submission_data.submission_type} already exists"
            )
        
        # Check if submission is late
        is_late = datetime.now() > submission_data.due_date
        
        # Create submission
        submission = ProjectSubmission(
            team_id=submission_data.team_id,
            semester_id=submission_data.semester_id,
            submission_type=submission_data.submission_type,
            notebook_url=submission_data.notebook_url,
            status="pending",
            due_date=submission_data.due_date,
            is_late=is_late
        )
        
        self.db.add(submission)
        self.db.commit()
        self.db.refresh(submission)
        
        return submission
    
    def confirm_submission(
        self,
        submission_id: int,
        user_id: int
    ) -> SubmissionConfirmation:
        """
        Confirm a submission by a team member.
        Automatically updates submission status to 'confirmed' when all members confirm.
        """
        # Get submission
        submission = self.db.query(ProjectSubmission).filter(
            ProjectSubmission.id == submission_id
        ).first()
        
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        # Verify user is member of the team
        team_member = self.db.query(TeamMember).filter(
            and_(
                TeamMember.team_id == submission.team_id,
                TeamMember.user_id == user_id
            )
        ).first()
        
        if not team_member:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of this team"
            )
        
        # Check if already confirmed
        existing_confirmation = self.db.query(SubmissionConfirmation).filter(
            and_(
                SubmissionConfirmation.submission_id == submission_id,
                SubmissionConfirmation.user_id == user_id
            )
        ).first()
        
        if existing_confirmation:
            raise HTTPException(
                status_code=400,
                detail="You have already confirmed this submission"
            )
        
        # Create confirmation
        confirmation = SubmissionConfirmation(
            submission_id=submission_id,
            user_id=user_id
        )
        
        self.db.add(confirmation)
        
        # Check if all team members have confirmed
        team_members_count = self.db.query(TeamMember).filter(
            TeamMember.team_id == submission.team_id
        ).count()
        
        confirmations_count = self.db.query(SubmissionConfirmation).filter(
            SubmissionConfirmation.submission_id == submission_id
        ).count() + 1  # +1 for the current confirmation
        
        # Update submission status if all members confirmed
        if confirmations_count >= team_members_count:
            submission.status = "confirmed"
        
        self.db.commit()
        self.db.refresh(confirmation)
        
        return confirmation
    
    def get_team_submissions(
        self,
        team_id: int,
        user_id: int
    ) -> List[ProjectSubmission]:
        """
        Get all submissions for a team.
        Validates that the user is a member of the team.
        """
        # Verify user is member of the team
        team_member = self.db.query(TeamMember).filter(
            and_(
                TeamMember.team_id == team_id,
                TeamMember.user_id == user_id
            )
        ).first()
        
        if not team_member:
            raise HTTPException(
                status_code=403,
                detail="You are not a member of this team"
            )
        
        submissions = self.db.query(ProjectSubmission).filter(
            ProjectSubmission.team_id == team_id
        ).order_by(ProjectSubmission.submitted_at.desc()).all()
        
        return submissions
    
    def grade_submission(
        self,
        submission_id: int,
        grade: float,
        feedback: Optional[str] = None
    ) -> ProjectSubmission:
        """
        Grade a submission (professor only).
        Updates status to 'graded'.
        """
        submission = self.db.query(ProjectSubmission).filter(
            ProjectSubmission.id == submission_id
        ).first()
        
        if not submission:
            raise HTTPException(status_code=404, detail="Submission not found")
        
        if submission.status != "confirmed":
            raise HTTPException(
                status_code=400,
                detail="Can only grade confirmed submissions"
            )
        
        submission.grade = grade
        submission.feedback = feedback
        submission.status = "graded"
        
        self.db.commit()
        self.db.refresh(submission)
        
        return submission
    
    def get_submission_by_id(
        self,
        submission_id: int
    ) -> Optional[ProjectSubmission]:
        """Get a submission by ID"""
        return self.db.query(ProjectSubmission).filter(
            ProjectSubmission.id == submission_id
        ).first()
    
    def get_all_submissions_by_semester(
        self,
        semester_id: int
    ) -> List[ProjectSubmission]:
        """Get all submissions for a semester (professor only)"""
        return self.db.query(ProjectSubmission).filter(
            ProjectSubmission.semester_id == semester_id
        ).order_by(ProjectSubmission.submitted_at.desc()).all()
    
    def validate_submission_content(
        self,
        submission_type: str,
        notebook_content: str
    ) -> Dict[str, Any]:
        """
        Validate submission content based on submission type.
        
        Args:
            submission_type: Type of submission (Trabajo_1, Trabajo_2, etc.)
            notebook_content: Content of the notebook as string
        
        Returns:
            Dict with validation results including:
            - is_valid: bool
            - missing_components: List[str]
            - warnings: List[str]
            - details: Dict with specific validation details
        """
        if submission_type == "Trabajo_1":
            return NotebookValidator.validate_trabajo_1(notebook_content)
        elif submission_type == "Trabajo_2":
            return NotebookValidator.validate_trabajo_2(notebook_content)
        
        # For other submission types, return basic validation
        return {
            "is_valid": True,
            "missing_components": [],
            "warnings": [],
            "details": {}
        }
