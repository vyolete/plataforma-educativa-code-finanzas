from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.semester import Semester
from app.schemas.semester import SemesterCreate, SemesterUpdate
from datetime import date, timedelta
from typing import Optional, List


class SemesterService:
    def __init__(self, db: Session):
        self.db = db
    
    def create_semester(self, semester_data: SemesterCreate) -> Semester:
        """
        Create a new semester.
        
        Requirements validated:
        - 33.1: Professor can create semester with start and end dates
        - 33.2: Automatically calculates duration in weeks
        - 33.3: Validates duration is between 15-20 weeks
        """
        # Calculate duration in weeks
        duration_weeks = self._calculate_duration_weeks(
            semester_data.start_date,
            semester_data.end_date
        )
        
        # Validate duration (Requirement 33.3)
        if duration_weeks < 15 or duration_weeks > 20:
            raise ValueError(
                f"Semester duration must be between 15 and 20 weeks. "
                f"Current duration: {duration_weeks} weeks"
            )
        
        # Create semester with 'active' status by default
        semester = Semester(
            name=semester_data.name,
            start_date=semester_data.start_date,
            end_date=semester_data.end_date,
            status='active'
        )
        
        self.db.add(semester)
        self.db.commit()
        self.db.refresh(semester)
        
        return semester
    
    def get_semester_by_id(self, semester_id: int) -> Optional[Semester]:
        """Get semester by ID."""
        return self.db.query(Semester).filter(Semester.id == semester_id).first()
    
    def get_all_semesters(self) -> List[Semester]:
        """Get all semesters ordered by creation date (newest first)."""
        return self.db.query(Semester).order_by(Semester.created_at.desc()).all()
    
    def get_active_semester(self) -> Optional[Semester]:
        """
        Get the currently active semester.
        
        Requirements validated:
        - 33.6: Only one active semester at a time
        """
        return self.db.query(Semester).filter(Semester.status == 'active').first()
    
    def update_semester(self, semester_id: int, semester_data: SemesterUpdate) -> Optional[Semester]:
        """Update semester information."""
        semester = self.get_semester_by_id(semester_id)
        if not semester:
            return None
        
        update_data = semester_data.model_dump(exclude_unset=True)
        
        # If dates are being updated, validate duration
        if 'start_date' in update_data or 'end_date' in update_data:
            start = update_data.get('start_date', semester.start_date)
            end = update_data.get('end_date', semester.end_date)
            
            if end <= start:
                raise ValueError('end_date must be after start_date')
            
            duration_weeks = self._calculate_duration_weeks(start, end)
            if duration_weeks < 15 or duration_weeks > 20:
                raise ValueError(
                    f"Semester duration must be between 15 and 20 weeks. "
                    f"Current duration: {duration_weeks} weeks"
                )
        
        for field, value in update_data.items():
            setattr(semester, field, value)
        
        self.db.commit()
        self.db.refresh(semester)
        
        return semester
    
    def archive_semester(self, semester_id: int) -> Optional[Semester]:
        """
        Archive a semester.
        
        Requirements validated:
        - 33.8: Professor can archive a semester
        - 33.9: Maintains all historical data
        - 33.10: Prevents new activities in archived semester
        """
        semester = self.get_semester_by_id(semester_id)
        if not semester:
            return None
        
        semester.status = 'archived'
        self.db.commit()
        self.db.refresh(semester)
        
        return semester
    
    def set_active_semester(self, semester_id: int) -> Optional[Semester]:
        """
        Set a semester as active, deactivating all others.
        
        Requirements validated:
        - 33.6: Mark semester as active
        - 33.7: Only one active semester at a time
        """
        semester = self.get_semester_by_id(semester_id)
        if not semester:
            return None
        
        # Deactivate all other semesters (Requirement 33.7)
        self.db.query(Semester).filter(
            Semester.id != semester_id
        ).update({"status": "archived"})
        
        # Activate the selected semester
        semester.status = 'active'
        
        self.db.commit()
        self.db.refresh(semester)
        
        return semester
    
    def calculate_due_dates(self, semester_id: int) -> dict:
        """
        Calculate delivery dates based on semester duration.
        
        Requirements validated:
        - 33.5: Calculates delivery dates automatically
        - 33.14: Trabajo_1 week 6, Trabajo_2 week 11, Concurso week 15, Examen_Final week 17
        - 33.15: Adjusts proportionally if duration differs from 17 weeks
        """
        semester = self.get_semester_by_id(semester_id)
        if not semester:
            return None
        
        duration_weeks = self._calculate_duration_weeks(
            semester.start_date,
            semester.end_date
        )
        
        # Standard schedule for 17-week semester
        standard_weeks = {
            'trabajo_1': 6,
            'trabajo_2': 11,
            'concurso': 15,
            'examen_final': 17
        }
        
        # If duration is exactly 17 weeks, use standard schedule
        if duration_weeks == 17:
            due_dates = {
                'trabajo_1': self._add_weeks(semester.start_date, 6),
                'trabajo_2': self._add_weeks(semester.start_date, 11),
                'concurso': self._add_weeks(semester.start_date, 15),
                'examen_final': self._add_weeks(semester.start_date, 17)
            }
        else:
            # Adjust proportionally (Requirement 33.15)
            ratio = duration_weeks / 17.0
            due_dates = {
                'trabajo_1': self._add_weeks(semester.start_date, int(6 * ratio)),
                'trabajo_2': self._add_weeks(semester.start_date, int(11 * ratio)),
                'concurso': self._add_weeks(semester.start_date, int(15 * ratio)),
                'examen_final': self._add_weeks(semester.start_date, int(17 * ratio))
            }
        
        return due_dates
    
    def _calculate_duration_weeks(self, start_date: date, end_date: date) -> int:
        """Calculate duration in weeks between two dates."""
        delta = end_date - start_date
        return delta.days // 7
    
    def _add_weeks(self, start_date: date, weeks: int) -> date:
        """Add weeks to a date."""
        return start_date + timedelta(weeks=weeks)
