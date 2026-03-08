from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, CheckConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Exercise(Base):
    """
    Exercise model for practice exercises with automatic validation.
    
    Attributes:
        id: Primary key
        module_id: Reference to module
        lesson_id: Reference to lesson (optional)
        title: Exercise title
        description: Exercise description
        difficulty: Difficulty level (beginner, intermediate, advanced)
        starter_code: Initial code template for students
        test_cases: JSON array of test cases for validation
        hints: JSON array of progressive hints
        points: Points awarded for completion
        created_at: Creation timestamp
    """
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), CheckConstraint("difficulty IN ('beginner', 'intermediate', 'advanced')"))
    starter_code = Column(Text)
    test_cases = Column(JSONB, nullable=False)
    hints = Column(JSONB)
    points = Column(Integer, default=10)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    submissions = relationship("ExerciseSubmission", back_populates="exercise")
    hint_usages = relationship("HintUsage", back_populates="exercise")


class ExerciseSubmission(Base):
    """
    Exercise submission model for tracking student solutions.
    
    Attributes:
        id: Primary key
        exercise_id: Reference to exercise
        user_id: Reference to user (student)
        code: Student's submitted code
        status: Submission status (correct, incorrect, pending)
        output: Execution output
        submitted_at: Submission timestamp
        execution_time_ms: Execution time in milliseconds
    """
    __tablename__ = "exercise_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    code = Column(Text, nullable=False)
    status = Column(String(20), CheckConstraint("status IN ('correct', 'incorrect', 'pending')"))
    output = Column(Text)
    submitted_at = Column(TIMESTAMP, server_default=func.now())
    execution_time_ms = Column(Integer)
    
    # Relationships
    exercise = relationship("Exercise", back_populates="submissions")
    user = relationship("User", back_populates="exercise_submissions")
