from pydantic import BaseModel, Field, validator
from typing import List, Optional
from datetime import datetime


class LessonContentResponse(BaseModel):
    """Schema for lesson content block response"""
    id: int
    lesson_id: int
    content_type: str = Field(..., description="Type of content: theory, example, exercise, tip, warning, code")
    content_order: int = Field(..., description="Order of content block within lesson")
    title: Optional[str] = Field(None, description="Optional title for content block")
    markdown_content: str = Field(..., description="Main content in Markdown format")
    code_example: Optional[str] = Field(None, description="Optional code example")
    code_language: str = Field(default="python", description="Programming language for code example")
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class LessonObjectiveResponse(BaseModel):
    """Schema for lesson objective response"""
    id: int
    lesson_id: int
    objective_text: str = Field(..., description="Learning objective description")
    objective_order: int = Field(..., description="Display order of objectives")
    created_at: datetime
    
    class Config:
        from_attributes = True


class LessonResponse(BaseModel):
    """Schema for basic lesson information (list view)"""
    id: int
    module_id: int
    title: str = Field(..., description="Lesson title")
    content: str = Field(..., description="Main lesson content (legacy field)")
    code_template: Optional[str] = Field(None, description="Optional code template")
    order_index: int = Field(..., description="Order of lesson within module")
    created_at: datetime
    
    class Config:
        from_attributes = True


class LessonDetailResponse(BaseModel):
    """Schema for detailed lesson information (detail view)"""
    id: int
    module_id: int
    title: str = Field(..., description="Lesson title")
    content: str = Field(..., description="Main lesson content (legacy field)")
    code_template: Optional[str] = Field(None, description="Optional code template")
    order_index: int = Field(..., description="Order of lesson within module")
    created_at: datetime
    content_blocks: List[LessonContentResponse] = Field(
        default_factory=list,
        description="Rich content blocks for the lesson"
    )
    objectives: List[LessonObjectiveResponse] = Field(
        default_factory=list,
        description="Learning objectives for the lesson"
    )
    
    class Config:
        from_attributes = True
    
    @validator('content_blocks', pre=True, always=True)
    def sort_content_blocks(cls, v):
        """Ensure content blocks are sorted by content_order"""
        if v:
            return sorted(v, key=lambda x: x.content_order if hasattr(x, 'content_order') else 0)
        return v
    
    @validator('objectives', pre=True, always=True)
    def sort_objectives(cls, v):
        """Ensure objectives are sorted by objective_order"""
        if v:
            return sorted(v, key=lambda x: x.objective_order if hasattr(x, 'objective_order') else 0)
        return v


class LessonCreate(BaseModel):
    """Schema for creating a new lesson"""
    module_id: int
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    code_template: Optional[str] = None
    order_index: int = Field(..., ge=0)


class LessonUpdate(BaseModel):
    """Schema for updating a lesson"""
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    content: Optional[str] = Field(None, min_length=1)
    code_template: Optional[str] = None
    order_index: Optional[int] = Field(None, ge=0)
