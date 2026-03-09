from sqlalchemy import Column, Integer, String, Text, ForeignKey, TIMESTAMP, CheckConstraint, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


# Association table for lesson prerequisites (many-to-many)
lesson_prerequisites = Table(
    'lesson_prerequisites',
    Base.metadata,
    Column('lesson_id', Integer, ForeignKey('lessons.id', ondelete='CASCADE'), primary_key=True),
    Column('prerequisite_lesson_id', Integer, ForeignKey('lessons.id', ondelete='CASCADE'), primary_key=True)
)


class Lesson(Base):
    """
    Lesson model for educational content within modules.
    
    Attributes:
        id: Primary key
        module_id: Reference to module
        title: Lesson title
        content: Main lesson content (legacy field, use lesson_content table for rich content)
        code_template: Optional code template for the lesson
        order_index: Order of lesson within module
        created_at: Creation timestamp
    """
    __tablename__ = "lessons"
    
    id = Column(Integer, primary_key=True, index=True)
    module_id = Column(Integer, ForeignKey("modules.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    code_template = Column(Text)
    order_index = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    content_blocks = relationship("LessonContent", back_populates="lesson", cascade="all, delete-orphan")
    objectives = relationship("LessonObjective", back_populates="lesson", cascade="all, delete-orphan")
    prerequisites = relationship(
        "Lesson",
        secondary=lesson_prerequisites,
        primaryjoin=id==lesson_prerequisites.c.lesson_id,
        secondaryjoin=id==lesson_prerequisites.c.prerequisite_lesson_id,
        backref="required_by"
    )


class LessonContent(Base):
    """
    Lesson content blocks for rich educational content.
    
    Attributes:
        id: Primary key
        lesson_id: Reference to lesson
        content_type: Type of content (theory, example, exercise, tip, warning, code)
        content_order: Order of content block within lesson
        title: Optional title for content block
        markdown_content: Main content in Markdown format
        code_example: Optional code example
        code_language: Programming language for code example (default: python)
        created_at: Creation timestamp
        updated_at: Last update timestamp
    """
    __tablename__ = "lesson_content"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    content_type = Column(
        String(50), 
        CheckConstraint("content_type IN ('theory', 'example', 'exercise', 'tip', 'warning', 'code')"),
        nullable=False
    )
    content_order = Column(Integer, nullable=False)
    title = Column(String(200))
    markdown_content = Column(Text, nullable=False)
    code_example = Column(Text)
    code_language = Column(String(20), default='python')
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
    
    # Relationships
    lesson = relationship("Lesson", back_populates="content_blocks")


class LessonObjective(Base):
    """
    Learning objectives for each lesson.
    
    Attributes:
        id: Primary key
        lesson_id: Reference to lesson
        objective_text: Learning objective description
        objective_order: Display order of objectives
        created_at: Creation timestamp
    """
    __tablename__ = "lesson_objectives"
    
    id = Column(Integer, primary_key=True, index=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False, index=True)
    objective_text = Column(Text, nullable=False)
    objective_order = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    
    # Relationships
    lesson = relationship("Lesson", back_populates="objectives")
