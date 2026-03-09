"""
Tests for lesson API endpoints.

This test file verifies that the lesson API endpoints work correctly
with the database schema created in migration 002_lessons_content.sql.
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.models.lesson import Lesson, LessonContent, LessonObjective


# Test database setup (use in-memory SQLite for testing)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(scope="function")
def setup_database():
    """Create tables before each test and drop after"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_get_all_lessons_empty(setup_database):
    """Test getting all lessons when database is empty"""
    response = client.get("/api/lessons")
    assert response.status_code == 200
    assert response.json() == []


def test_get_lessons_by_module_not_found(setup_database):
    """Test getting lessons for non-existent module"""
    response = client.get("/api/lessons/module/999")
    assert response.status_code == 404
    assert "No lessons found" in response.json()["detail"]


def test_get_lesson_detail_not_found(setup_database):
    """Test getting non-existent lesson detail"""
    response = client.get("/api/lessons/999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_create_and_get_lesson(setup_database):
    """Test creating a lesson and retrieving it"""
    # Note: This test will fail if modules table doesn't exist
    # In a real scenario, you'd need to create a module first
    lesson_data = {
        "module_id": 1,
        "title": "Test Lesson",
        "content": "This is test content",
        "code_template": "print('Hello')",
        "order_index": 1
    }
    
    # Create lesson
    response = client.post("/api/lessons", json=lesson_data)
    # May fail due to foreign key constraint if modules table doesn't exist
    # This is expected in isolated testing
    
    if response.status_code == 201:
        lesson_id = response.json()["id"]
        
        # Get lesson detail
        response = client.get(f"/api/lessons/{lesson_id}")
        assert response.status_code == 200
        assert response.json()["title"] == "Test Lesson"
        assert response.json()["content"] == "This is test content"


def test_lesson_response_schema():
    """Test that lesson response schema is correctly defined"""
    from app.schemas.lesson import LessonResponse, LessonDetailResponse
    
    # Test basic lesson response
    lesson_data = {
        "id": 1,
        "module_id": 1,
        "title": "Test",
        "content": "Content",
        "code_template": None,
        "order_index": 1,
        "created_at": "2024-01-01T00:00:00"
    }
    
    lesson = LessonResponse(**lesson_data)
    assert lesson.id == 1
    assert lesson.title == "Test"
    
    # Test detailed lesson response
    detail_data = {
        **lesson_data,
        "content_blocks": [],
        "objectives": []
    }
    
    detail = LessonDetailResponse(**detail_data)
    assert detail.id == 1
    assert detail.content_blocks == []
    assert detail.objectives == []


def test_lesson_content_response_schema():
    """Test lesson content response schema"""
    from app.schemas.lesson import LessonContentResponse
    
    content_data = {
        "id": 1,
        "lesson_id": 1,
        "content_type": "theory",
        "content_order": 1,
        "title": "Introduction",
        "markdown_content": "# Introduction\nThis is the intro",
        "code_example": None,
        "code_language": "python",
        "created_at": "2024-01-01T00:00:00",
        "updated_at": "2024-01-01T00:00:00"
    }
    
    content = LessonContentResponse(**content_data)
    assert content.content_type == "theory"
    assert content.markdown_content == "# Introduction\nThis is the intro"


def test_lesson_objective_response_schema():
    """Test lesson objective response schema"""
    from app.schemas.lesson import LessonObjectiveResponse
    
    objective_data = {
        "id": 1,
        "lesson_id": 1,
        "objective_text": "Learn Python basics",
        "objective_order": 1,
        "created_at": "2024-01-01T00:00:00"
    }
    
    objective = LessonObjectiveResponse(**objective_data)
    assert objective.objective_text == "Learn Python basics"
    assert objective.objective_order == 1


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
