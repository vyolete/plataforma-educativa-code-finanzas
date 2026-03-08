from sqlalchemy.orm import Session
from app.models.grade import Grade
from app.models.progress import StudentProgress, CodeActivity
from app.models.exercise import ExerciseSubmission
from app.models.user import User
from typing import Optional


class GradingService:
    """Service for managing grades and calculating seguimiento."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def calculate_seguimiento(self, user_id: int, semester_id: int) -> float:
        """
        Calculate seguimiento (continuous assessment) grade based on:
        - Exercises completed: 40%
        - Code activity: 30%
        - Participation (tutorials/quizzes): 20%
        - Module progress: 10%
        
        Returns a grade from 0 to 5.0
        """
        # Get user's progress data
        progress_records = self.db.query(StudentProgress).filter(
            StudentProgress.user_id == user_id
        ).all()
        
        # Calculate exercises completion rate (40%)
        total_exercises = sum(p.exercises_total for p in progress_records)
        completed_exercises = sum(p.exercises_completed for p in progress_records)
        exercises_score = (completed_exercises / total_exercises * 5.0 * 0.40) if total_exercises > 0 else 0
        
        # Calculate code activity score (30%)
        code_activities = self.db.query(CodeActivity).filter(
            CodeActivity.user_id == user_id
        ).count()
        # Normalize: 50+ activities = full score
        activity_score = min(code_activities / 50, 1.0) * 5.0 * 0.30
        
        # Calculate participation score (20%)
        # For now, based on exercise submissions with hints usage
        submissions = self.db.query(ExerciseSubmission).filter(
            ExerciseSubmission.user_id == user_id,
            ExerciseSubmission.status == "completed"
        ).count()
        # Normalize: 30+ submissions = full score
        participation_score = min(submissions / 30, 1.0) * 5.0 * 0.20
        
        # Calculate module progress score (10%)
        # Count modules with >50% completion
        modules_with_progress = sum(
            1 for p in progress_records 
            if p.exercises_total > 0 and (p.exercises_completed / p.exercises_total) > 0.5
        )
        # Normalize: 6+ modules = full score (out of 8 total)
        module_score = min(modules_with_progress / 6, 1.0) * 5.0 * 0.10
        
        # Total seguimiento grade
        seguimiento = exercises_score + activity_score + participation_score + module_score
        
        return round(seguimiento, 2)
    
    def get_or_create_grade(self, user_id: int, semester_id: int) -> Grade:
        """Get existing grade record or create a new one."""
        grade = self.db.query(Grade).filter(
            Grade.user_id == user_id,
            Grade.semester_id == semester_id
        ).first()
        
        if not grade:
            grade = Grade(
                user_id=user_id,
                semester_id=semester_id,
                trabajo_1=None,
                trabajo_2=None,
                concurso=None,
                examen=None,
                seguimiento=None
            )
            self.db.add(grade)
            self.db.commit()
            self.db.refresh(grade)
        
        return grade
    
    def update_grade(
        self,
        user_id: int,
        semester_id: int,
        trabajo_1: Optional[float] = None,
        trabajo_2: Optional[float] = None,
        concurso: Optional[float] = None,
        examen: Optional[float] = None,
        seguimiento: Optional[float] = None
    ) -> Grade:
        """Update grade components for a user."""
        grade = self.get_or_create_grade(user_id, semester_id)
        
        if trabajo_1 is not None:
            grade.trabajo_1 = trabajo_1
        if trabajo_2 is not None:
            grade.trabajo_2 = trabajo_2
        if concurso is not None:
            grade.concurso = concurso
        if examen is not None:
            grade.examen = examen
        if seguimiento is not None:
            grade.seguimiento = seguimiento
        
        self.db.commit()
        self.db.refresh(grade)
        
        return grade
    
    def recalculate_seguimiento(self, user_id: int, semester_id: int) -> Grade:
        """Recalculate and update seguimiento for a user."""
        seguimiento = self.calculate_seguimiento(user_id, semester_id)
        return self.update_grade(user_id, semester_id, seguimiento=seguimiento)
    
    def get_semester_grades(self, semester_id: int) -> list[Grade]:
        """Get all grades for a semester."""
        return self.db.query(Grade).filter(
            Grade.semester_id == semester_id
        ).all()
    
    def get_user_grade(self, user_id: int, semester_id: int) -> Optional[Grade]:
        """Get grade for a specific user in a semester."""
        return self.db.query(Grade).filter(
            Grade.user_id == user_id,
            Grade.semester_id == semester_id
        ).first()
