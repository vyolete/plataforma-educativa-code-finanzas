from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


class TestCase(BaseModel):
    """Test case for exercise validation"""
    input: str = Field(..., description="Input for the test case")
    expected_output: str = Field(..., description="Expected output")
    description: str = Field(..., description="Description of what the test validates")


class ExerciseBase(BaseModel):
    """Base schema for Exercise"""
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=1)
    difficulty: str = Field(..., pattern="^(beginner|intermediate|advanced)$")
    starter_code: Optional[str] = None
    test_cases: List[TestCase] = Field(..., min_items=1)
    hints: Optional[List[str]] = None
    points: int = Field(default=10, ge=0)


class ExerciseCreate(ExerciseBase):
    """Schema for creating an exercise"""
    module_id: int = Field(..., gt=0)
    lesson_id: Optional[int] = Field(None, gt=0)


class ExerciseUpdate(BaseModel):
    """Schema for updating an exercise"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None, min_length=1)
    difficulty: Optional[str] = Field(None, pattern="^(beginner|intermediate|advanced)$")
    starter_code: Optional[str] = None
    test_cases: Optional[List[TestCase]] = None
    hints: Optional[List[str]] = None
    points: Optional[int] = Field(None, ge=0)


class ExerciseResponse(ExerciseBase):
    """Schema for exercise response"""
    id: int
    module_id: int
    lesson_id: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True


class ExerciseSubmissionBase(BaseModel):
    """Base schema for ExerciseSubmission"""
    code: str = Field(..., min_length=1)


class ExerciseSubmissionCreate(ExerciseSubmissionBase):
    """Schema for creating an exercise submission"""
    exercise_id: int = Field(..., gt=0)


class ExerciseSubmissionResponse(ExerciseSubmissionBase):
    """Schema for exercise submission response"""
    id: int
    exercise_id: int
    user_id: int
    status: str
    output: Optional[str]
    submitted_at: datetime
    execution_time_ms: Optional[int]
    
    class Config:
        from_attributes = True


class ExerciseValidationResult(BaseModel):
    """Schema for exercise validation result"""
    status: str = Field(..., pattern="^(correct|incorrect|pending)$")
    passed_tests: int = Field(..., ge=0)
    total_tests: int = Field(..., gt=0)
    failed_tests: List[Dict[str, Any]] = Field(default_factory=list)
    output: str
    execution_time_ms: int


class HintRequest(BaseModel):
    """Schema for requesting hints"""
    exercise_id: int = Field(..., gt=0)
    hint_level: int = Field(..., ge=1, le=3, description="Hint level (1-3)")
