from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Boolean, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class ProjectSubmission(Base):
    __tablename__ = "project_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id"))
    semester_id = Column(Integer, ForeignKey("semesters.id"))
    submission_type = Column(String(50))  # 'trabajo_1', 'trabajo_2', 'concurso', 'examen'
    notebook_url = Column(Text, nullable=False)
    status = Column(String(20))  # 'pending', 'confirmed', 'graded'
    grade = Column(Numeric(5, 2))
    feedback = Column(Text)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    due_date = Column(DateTime(timezone=True), nullable=False)
    is_late = Column(Boolean, default=False)
    
    # Relationships
    semester = relationship("Semester", back_populates="project_submissions")
    confirmations = relationship("SubmissionConfirmation", back_populates="submission", cascade="all, delete-orphan")


class SubmissionConfirmation(Base):
    __tablename__ = "submission_confirmations"
    
    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("project_submissions.id", ondelete="CASCADE"))
    user_id = Column(Integer, ForeignKey("users.id"))
    confirmed_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    submission = relationship("ProjectSubmission", back_populates="confirmations")
