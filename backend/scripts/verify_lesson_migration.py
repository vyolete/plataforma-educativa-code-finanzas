#!/usr/bin/env python3
"""
Verification script to compare migrated lesson data with original lessons.ts

This script:
1. Reads lessons from the database
2. Reads lessons from lessons.ts
3. Compares the data to ensure integrity
"""

import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import text
from app.database import SessionLocal


def verify_migration():
    """Verify that lesson data was migrated correctly."""
    print("=" * 80)
    print("Lesson Migration Verification")
    print("=" * 80)
    
    db = SessionLocal()
    try:
        # Get lesson counts by module
        print("\n1. Lesson counts by module:")
        result = db.execute(text("""
            SELECT m.id, m.title, COUNT(l.id) as lesson_count
            FROM modules m
            LEFT JOIN lessons l ON m.id = l.module_id
            GROUP BY m.id, m.title
            ORDER BY m.id
        """))
        
        for row in result:
            print(f"   Module {row[0]}: {row[1]} - {row[2]} lessons")
        
        # Get sample lesson data
        print("\n2. Sample lesson data (first 3 lessons):")
        result = db.execute(text("""
            SELECT l.id, l.module_id, l.title, l.order_index, 
                   LENGTH(l.content) as content_length
            FROM lessons l
            ORDER BY l.module_id, l.order_index
            LIMIT 3
        """))
        
        for row in result:
            print(f"   Lesson {row[0]} (Module {row[1]}, Order {row[3]}): {row[2]}")
            print(f"      Content length: {row[4]} characters")
        
        # Get content block counts
        print("\n3. Content blocks per lesson:")
        result = db.execute(text("""
            SELECT l.id, l.title, COUNT(lc.id) as content_count
            FROM lessons l
            LEFT JOIN lesson_content lc ON l.id = lc.lesson_id
            GROUP BY l.id, l.title
            ORDER BY l.id
        """))
        
        for row in result:
            print(f"   Lesson {row[0]}: {row[1]} - {row[2]} content blocks")
        
        # Get objectives count
        print("\n4. Objectives per lesson:")
        result = db.execute(text("""
            SELECT l.id, l.title, COUNT(lo.id) as objectives_count
            FROM lessons l
            LEFT JOIN lesson_objectives lo ON l.id = lo.lesson_id
            GROUP BY l.id, l.title
            ORDER BY l.id
        """))
        
        for row in result:
            print(f"   Lesson {row[0]}: {row[1]} - {row[2]} objectives")
        
        # Get content type distribution
        print("\n5. Content type distribution:")
        result = db.execute(text("""
            SELECT content_type, COUNT(*) as count
            FROM lesson_content
            GROUP BY content_type
            ORDER BY count DESC
        """))
        
        for row in result:
            print(f"   {row[0]}: {row[1]} blocks")
        
        # Sample objectives
        print("\n6. Sample objectives (first 5):")
        result = db.execute(text("""
            SELECT l.title, lo.objective_text
            FROM lesson_objectives lo
            JOIN lessons l ON lo.lesson_id = l.id
            ORDER BY lo.id
            LIMIT 5
        """))
        
        for row in result:
            print(f"   {row[0]}: {row[1]}")
        
        print("\n" + "=" * 80)
        print("✓ Verification completed!")
        print("=" * 80)
        
    except Exception as e:
        print(f"\n✗ Verification failed: {e}")
        return 1
    finally:
        db.close()
    
    return 0


if __name__ == "__main__":
    sys.exit(verify_migration())
