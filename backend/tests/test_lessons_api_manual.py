"""
Manual test script to verify lesson API endpoints work with the actual database.

Run this script to test the lesson API endpoints against the real Supabase database.
This assumes the database has been migrated with 002_lessons_content.sql.

Usage:
    python3 tests/test_lessons_api_manual.py
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal, check_db_connection
from app.models.lesson import Lesson, LessonContent, LessonObjective


def test_database_connection():
    """Test if database connection works"""
    print("Testing database connection...")
    if check_db_connection():
        print("✓ Database connection successful")
        return True
    else:
        print("✗ Database connection failed")
        return False


def test_query_lessons():
    """Test querying lessons from database"""
    print("\nTesting lesson queries...")
    db = SessionLocal()
    try:
        # Query all lessons
        lessons = db.query(Lesson).all()
        print(f"✓ Found {len(lessons)} lessons in database")
        
        if lessons:
            # Show first lesson
            first_lesson = lessons[0]
            print(f"  First lesson: ID={first_lesson.id}, Title='{first_lesson.title}'")
            
            # Query lesson content
            content_count = db.query(LessonContent).filter(
                LessonContent.lesson_id == first_lesson.id
            ).count()
            print(f"  Content blocks for lesson {first_lesson.id}: {content_count}")
            
            # Query lesson objectives
            objectives_count = db.query(LessonObjective).filter(
                LessonObjective.lesson_id == first_lesson.id
            ).count()
            print(f"  Objectives for lesson {first_lesson.id}: {objectives_count}")
        
        return True
    except Exception as e:
        print(f"✗ Error querying lessons: {e}")
        return False
    finally:
        db.close()


def test_api_imports():
    """Test that API modules can be imported"""
    print("\nTesting API imports...")
    try:
        from app.api.lessons import router
        print(f"✓ Lessons API router imported successfully")
        print(f"  Routes: {[route.path for route in router.routes]}")
        return True
    except Exception as e:
        print(f"✗ Error importing API: {e}")
        return False


def test_schema_validation():
    """Test schema validation"""
    print("\nTesting schema validation...")
    try:
        from app.schemas.lesson import (
            LessonResponse,
            LessonDetailResponse,
            LessonContentResponse,
            LessonObjectiveResponse
        )
        
        # Test basic lesson response
        lesson_data = {
            "id": 1,
            "module_id": 1,
            "title": "Test Lesson",
            "content": "Test content",
            "code_template": None,
            "order_index": 1,
            "created_at": "2024-01-01T00:00:00"
        }
        lesson = LessonResponse(**lesson_data)
        print(f"✓ LessonResponse schema validated")
        
        # Test detailed lesson response
        detail_data = {
            **lesson_data,
            "content_blocks": [],
            "objectives": []
        }
        detail = LessonDetailResponse(**detail_data)
        print(f"✓ LessonDetailResponse schema validated")
        
        return True
    except Exception as e:
        print(f"✗ Error validating schemas: {e}")
        return False


def main():
    """Run all tests"""
    print("=" * 60)
    print("Lesson API Manual Tests")
    print("=" * 60)
    
    results = []
    
    # Run tests
    results.append(("Database Connection", test_database_connection()))
    results.append(("API Imports", test_api_imports()))
    results.append(("Schema Validation", test_schema_validation()))
    results.append(("Query Lessons", test_query_lessons()))
    
    # Summary
    print("\n" + "=" * 60)
    print("Test Summary")
    print("=" * 60)
    for test_name, passed in results:
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{status}: {test_name}")
    
    all_passed = all(result[1] for result in results)
    print("\n" + ("All tests passed!" if all_passed else "Some tests failed."))
    
    return 0 if all_passed else 1


if __name__ == "__main__":
    sys.exit(main())
