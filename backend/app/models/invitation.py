from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Invitation(Base):
    __tablename__ = "invitations"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, index=True)
    semester_id = Column(Integer, ForeignKey("semesters.id"), nullable=False)
    token = Column(String(255), unique=True, nullable=False, index=True)
    status = Column(String(20), nullable=False)  # 'sent', 'registered', 'pending'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True), nullable=False)
    
    # Relationships
    semester = relationship("Semester", back_populates="invitations")
    
    def __repr__(self):
        return f"<Invitation(id={self.id}, email='{self.email}', status='{self.status}')>"
