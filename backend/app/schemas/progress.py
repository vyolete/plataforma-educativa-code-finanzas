"""
Progress tracking schemas for student activity and module completion.
"""
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, computed_field


class StudentProgressResponse(BaseModel):
    """Schema for returning individual student progress data."""
    id: int
    user_id: int
    module_id: int
    exercises_completed: int = Field(ge=0)
    exercises_total: int = Field(gt=0)
    last_activity: Optional[datetime] = None

    @computed_field
    @property
    def completion_percentage(self) -> float:
        """Calculate completion percentage."""
        if self.exercises_total == 0:
            return 0.0
        return round((self.exercises_completed / self.exercises_total) * 100, 2)

    model_config = {"from_attributes": True}


class ModuleProgressResponse(BaseModel):
    """Schema for module-specific progress information."""
    module_id: int
    module_name: str
    exercises_completed: int = Field(ge=0)
    exercises_total: int = Field(gt=0)
    last_activity: Optional[datetime] = None

    @computed_field
    @property
    def completion_percentage(self) -> float:
        """Calculate module completion percentage."""
        if self.exercises_total == 0:
            return 0.0
        return round((self.exercises_completed / self.exercises_total) * 100, 2)

    model_config = {"from_attributes": True}


class CodeActivityCreate(BaseModel):
    """Schema for creating code activity records."""
    code_snippet: str = Field(min_length=1, max_length=10000)
    execution_count: int = Field(default=1, ge=1)


class CodeActivityResponse(BaseModel):
    """Schema for returning code activity data."""
    id: int
    user_id: int
    code_snippet: str
    execution_count: int = Field(ge=1)
    last_executed: datetime

    model_config = {"from_attributes": True}


class OverallProgressResponse(BaseModel):
    """Schema for dashboard overview with complete progress information."""
    total_exercises_completed: int = Field(ge=0)
    total_exercises: int = Field(gt=0)
    modules_progress: List[ModuleProgressResponse]
    recent_activity: List[CodeActivityResponse] = Field(
        default_factory=list,
        description="Last 10 code execution activities"
    )
    total_code_executions: int = Field(ge=0)

    @computed_field
    @property
    def overall_completion_percentage(self) -> float:
        """Calculate overall completion percentage across all modules."""
        if self.total_exercises == 0:
            return 0.0
        return round((self.total_exercises_completed / self.total_exercises) * 100, 2)

    model_config = {"from_attributes": True}
