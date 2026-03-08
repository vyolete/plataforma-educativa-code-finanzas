#!/usr/bin/env python3
"""
Test database connection script.
Run this after setting up your Supabase database to verify connectivity.

Usage:
    python scripts/test_db_connection.py
"""

import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.database import engine, check_db_connection
from sqlalchemy import text


def test_connection():
    """Test basic database connection."""
    print("Testing database connection...")
    
    if check_db_connection():
        print("✅ Database connection successful!")
        return True
    else:
        print("❌ Database connection failed!")
        return False


def test_tables():
    """Test that all required tables exist."""
    print("\nChecking database tables...")
    
    required_tables = [
        'users', 'semesters', 'invitations', 'teams', 'team_members',
        'modules', 'lessons', 'exercises', 'exercise_submissions',
        'project_submissions', 'submission_confirmations', 'grades',
        'student_progress', 'code_activity', 'badges', 'user_badges',
        'experience_points'
    ]
    
    try:
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            
            existing_tables = [row[0] for row in result]
            
            print(f"\nFound {len(existing_tables)} tables:")
            for table in existing_tables:
                print(f"  - {table}")
            
            missing_tables = set(required_tables) - set(existing_tables)
            
            if missing_tables:
                print(f"\n❌ Missing tables: {', '.join(missing_tables)}")
                print("\nPlease run the migration script:")
                print("  backend/migrations/001_initial_schema.sql")
                return False
            else:
                print(f"\n✅ All {len(required_tables)} required tables exist!")
                return True
                
    except Exception as e:
        print(f"❌ Error checking tables: {e}")
        return False


def test_indexes():
    """Test that indexes were created."""
    print("\nChecking database indexes...")
    
    try:
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT COUNT(*) as index_count
                FROM pg_indexes 
                WHERE schemaname = 'public'
            """))
            
            index_count = result.fetchone()[0]
            print(f"✅ Found {index_count} indexes")
            
            if index_count < 20:
                print("⚠️  Warning: Expected at least 20 indexes. Some may be missing.")
                return False
            
            return True
            
    except Exception as e:
        print(f"❌ Error checking indexes: {e}")
        return False


def test_computed_columns():
    """Test that computed columns work correctly."""
    print("\nTesting computed columns...")
    
    try:
        with engine.connect() as connection:
            # Test grades.final_grade computation
            print("  Testing grades.final_grade computation...")
            connection.execute(text("""
                INSERT INTO semesters (name, start_date, end_date, status)
                VALUES ('Test Semester', '2024-01-01', '2024-06-01', 'active')
            """))
            
            connection.execute(text("""
                INSERT INTO users (email, password_hash, full_name, role)
                VALUES ('test@correo.itm.edu.co', 'hash', 'Test User', 'student')
            """))
            
            connection.execute(text("""
                INSERT INTO grades (user_id, semester_id, trabajo_1, trabajo_2, concurso, examen, seguimiento)
                VALUES (
                    (SELECT id FROM users WHERE email = 'test@correo.itm.edu.co'),
                    (SELECT id FROM semesters WHERE name = 'Test Semester'),
                    80, 85, 90, 75, 88
                )
            """))
            
            result = connection.execute(text("""
                SELECT final_grade FROM grades 
                WHERE user_id = (SELECT id FROM users WHERE email = 'test@correo.itm.edu.co')
            """))
            
            final_grade = result.fetchone()[0]
            expected = (80 * 0.20) + (85 * 0.20) + (90 * 0.20) + (75 * 0.20) + (88 * 0.20)
            
            if abs(float(final_grade) - expected) < 0.01:
                print(f"    ✅ final_grade computed correctly: {final_grade}")
            else:
                print(f"    ❌ final_grade incorrect: got {final_grade}, expected {expected}")
                return False
            
            # Cleanup test data
            connection.execute(text("DELETE FROM grades WHERE user_id = (SELECT id FROM users WHERE email = 'test@correo.itm.edu.co')"))
            connection.execute(text("DELETE FROM users WHERE email = 'test@correo.itm.edu.co'"))
            connection.execute(text("DELETE FROM semesters WHERE name = 'Test Semester'"))
            connection.commit()
            
            print("✅ Computed columns working correctly!")
            return True
            
    except Exception as e:
        print(f"❌ Error testing computed columns: {e}")
        # Try to cleanup
        try:
            with engine.connect() as connection:
                connection.execute(text("DELETE FROM grades WHERE user_id = (SELECT id FROM users WHERE email = 'test@correo.itm.edu.co')"))
                connection.execute(text("DELETE FROM users WHERE email = 'test@correo.itm.edu.co'"))
                connection.execute(text("DELETE FROM semesters WHERE name = 'Test Semester'"))
                connection.commit()
        except:
            pass
        return False


def main():
    """Run all database tests."""
    print("=" * 60)
    print("Database Connection Test Suite")
    print("=" * 60)
    
    tests = [
        ("Connection", test_connection),
        ("Tables", test_tables),
        ("Indexes", test_indexes),
        ("Computed Columns", test_computed_columns),
    ]
    
    results = []
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"\n❌ Test '{test_name}' failed with exception: {e}")
            results.append((test_name, False))
    
    print("\n" + "=" * 60)
    print("Test Results Summary")
    print("=" * 60)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    all_passed = all(result for _, result in results)
    
    if all_passed:
        print("\n🎉 All tests passed! Database is ready to use.")
        return 0
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
