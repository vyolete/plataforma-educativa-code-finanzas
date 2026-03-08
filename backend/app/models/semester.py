from sqlalchemy import Column, Integer, String, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Semester(Base):
    __tablename__ = "semesters"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status = Column(String(20), nullable=False)  # 'active' or 'archived'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    users = relationship("User", back_populates="semester")
    invitations = relationship("Invitation", back_populates="semester")
    teams = relationship("Team", back_populates="semester")
    project_submissions = relationship("ProjectSubmission", back_populates="semester")
    grades = relationship("Grade", back_populates="semester")
    
    def __repr__(self):
        return f"<Semester(id={self.id}, name='{self.name}', status='{self.status}')>"
