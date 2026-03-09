#!/usr/bin/env python3
"""
Migration Script: 002_lessons_content.sql
Executes the lesson content migration on Supabase database

This script:
1. Connects to Supabase PostgreSQL
2. Executes the migration SQL file
3. Verifies tables were created correctly
4. Reports success or errors
"""

import os
import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.database import engine
from app.config import settings


def read_migration_file(filename: str) -> str:
    """Read migration SQL file"""
    migration_path = Path(__file__).parent.parent / "migrations" / filename
    
    if not migration_path.exists():
        raise FileNotFoundError(f"Migration file not found: {migration_path}")
    
    with open(migration_path, 'r', encoding='utf-8') as f:
        return f.read()


def execute_migration(sql: str) -> None:
    """Execute migration SQL"""
    print("Connecting to database...")
    print(f"Database URL: {settings.DATABASE_URL.split('@')[1] if '@' in settings.DATABASE_URL else 'localhost'}")
    
    with engine.connect() as connection:
        # Execute the migration
        print("\nExecuting migration...")
        connection.execute(text(sql))
        connection.commit()
        print("✓ Migration executed successfully")


def verify_tables() -> None:
    """Verify that tables were created correctly"""
    print("\nVerifying tables...")
    
    verification_queries = [
        ("lesson_content", "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'lesson_content'"),
        ("lesson_objectives", "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'lesson_objectives'"),
        ("lesson_prerequisites", "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'lesson_prerequisites'"),
    ]
    
    with engine.connect() as connection:
        for table_name, query in verification_queries:
            result = connection.execute(text(query))
            count = result.scalar()
            if count == 1:
                print(f"✓ Table '{table_name}' created successfully")
            else:
                print(f"✗ Table '{table_name}' NOT found")
                return False
    
    return True


def verify_indexes() -> None:
    """Verify that indexes were created correctly"""
    print("\nVerifying indexes...")
    
    query = """
    SELECT indexname, tablename 
    FROM pg_indexes 
    WHERE schemaname = 'public' AND tablename LIKE 'lesson%' 
    ORDER BY tablename, indexname
    """
    
    with engine.connect() as connection:
        result = connection.execute(text(query))
        indexes = result.fetchall()
        
        if indexes:
            print(f"✓ Found {len(indexes)} indexes:")
            for index_name, table_name in indexes:
                print(f"  - {table_name}.{index_name}")
        else:
            print("✗ No indexes found")


def verify_foreign_keys() -> None:
    """Verify that foreign key constraints were created correctly"""
    print("\nVerifying foreign key constraints...")
    
    query = """
    SELECT conname, conrelid::regclass AS table_name, confrelid::regclass AS referenced_table
    FROM pg_constraint 
    WHERE contype = 'f' AND conrelid::regclass::text LIKE 'lesson%'
    ORDER BY conrelid::regclass::text
    """
    
    with engine.connect() as connection:
        result = connection.execute(text(query))
        foreign_keys = result.fetchall()
        
        if foreign_keys:
            print(f"✓ Found {len(foreign_keys)} foreign key constraints:")
            for constraint_name, table_name, referenced_table in foreign_keys:
                print(f"  - {table_name} → {referenced_table} ({constraint_name})")
        else:
            print("✗ No foreign key constraints found")


def main():
    """Main execution function"""
    print("=" * 70)
    print("Migration: 002_lessons_content.sql")
    print("Purpose: Create tables for lesson content, objectives, and prerequisites")
    print("=" * 70)
    
    try:
        # Read migration file
        sql = read_migration_file("002_lessons_content.sql")
        print(f"\n✓ Migration file loaded ({len(sql)} characters)")
        
        # Execute migration
        execute_migration(sql)
        
        # Verify tables
        if verify_tables():
            print("\n✓ All tables verified successfully")
        else:
            print("\n✗ Table verification failed")
            sys.exit(1)
        
        # Verify indexes
        verify_indexes()
        
        # Verify foreign keys
        verify_foreign_keys()
        
        print("\n" + "=" * 70)
        print("✓ MIGRATION COMPLETED SUCCESSFULLY")
        print("=" * 70)
        print("\nNext steps:")
        print("1. Run migration script to populate data from lessons.ts")
        print("2. Update backend API to serve lesson content from database")
        print("3. Update frontend to fetch lessons via API")
        
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
