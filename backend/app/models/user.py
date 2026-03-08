from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False)  # 'student' or 'professor'
    semester_id = Column(Integer, ForeignKey("semesters.id"), nullable=True)
    github_token = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    semester = relationship("Semester", back_populates="users")
    team_memberships = relationship("TeamMember", back_populates="user")
    exercise_submissions = relationship("ExerciseSubmission", back_populates="user")
    grades = relationship("Grade", back_populates="user")
    progress = relationship("StudentProgress", back_populates="user")
    code_activities = relationship("CodeActivity", back_populates="user")
    user_badges = relationship("UserBadge", back_populates="user")
    experience_points = relationship("ExperiencePoint", back_populates="user")
    hint_usages = relationship("HintUsage", back_populates="user")
    
    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"
