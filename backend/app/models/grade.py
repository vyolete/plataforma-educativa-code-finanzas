from sqlalchemy import Column, Integer, DateTime, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Grade(Base):
    __tablename__ = "grades"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    semester_id = Column(Integer, ForeignKey("semesters.id"))
    trabajo_1 = Column(Numeric(5, 2))
    trabajo_2 = Column(Numeric(5, 2))
    concurso = Column(Numeric(5, 2))
    examen = Column(Numeric(5, 2))
    seguimiento = Column(Numeric(5, 2))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="grades")
    semester = relationship("Semester", back_populates="grades")
    
    def calculate_final_grade(self) -> float:
        """
        Calculate final grade as weighted sum of all components.
        Formula: (Trabajo_1 × 0.20) + (Trabajo_2 × 0.20) + (Concurso × 0.20) + (Examen × 0.20) + (Seguimiento × 0.20)
        """
        components = [
            self.trabajo_1 or 0,
            self.trabajo_2 or 0,
            self.concurso or 0,
            self.examen or 0,
            self.seguimiento or 0
        ]
        
        # Each component is worth 20%
        final_grade = sum(float(component) * 0.20 for component in components)
        return round(final_grade, 2)
