#!/usr/bin/env python3
"""
Comparison script to verify migrated data matches original lessons.ts

This script compares:
1. Lesson titles
2. Module assignments
3. Order indices
4. Content presence
"""

import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import text
from app.database import SessionLocal

# Expected lessons from lessons.ts (based on parsing)
EXPECTED_LESSONS = [
    # Module 1
    {"id": "1-1", "module": 1, "order": 1, "title": "Variables y Tipos de Datos"},
    {"id": "1-2", "module": 1, "order": 2, "title": "Operadores y Expresiones"},
    {"id": "1-3", "module": 1, "order": 3, "title": "Estructuras de Control"},
    {"id": "1-4", "module": 1, "order": 4, "title": "Funciones Básicas"},
    # Module 2
    {"id": "2-1", "module": 2, "order": 1, "title": "Listas y Tuplas"},
    {"id": "2-2", "module": 2, "order": 2, "title": "Diccionarios y Sets"},
    {"id": "2-3", "module": 2, "order": 3, "title": "Comprensiones de Listas"},
    {"id": "2-4", "module": 2, "order": 4, "title": "Manipulación de Strings"},
    # Module 3
    {"id": "3-1", "module": 3, "order": 1, "title": "DataFrames y Series"},
    {"id": "3-2", "module": 3, "order": 2, "title": "Lectura y Escritura de Datos"},
    {"id": "3-3", "module": 3, "order": 3, "title": "Filtrado y Selección"},
]


def compare_lessons():
    """Compare database lessons with expected lessons."""
    print("=" * 80)
    print("Lesson Data Comparison")
    print("=" * 80)
    
    db = SessionLocal()
    try:
        # Get all lessons from database
        result = db.execute(text("""
            SELECT l.id, l.module_id, l.order_index, l.title, LENGTH(l.content) as content_length
            FROM lessons l
            ORDER BY l.module_id, l.order_index
        """))
        
        db_lessons = list(result)
        
        print(f"\n✓ Expected lessons: {len(EXPECTED_LESSONS)}")
        print(f"✓ Database lessons: {len(db_lessons)}")
        
        if len(db_lessons) != len(EXPECTED_LESSONS):
            print(f"\n✗ ERROR: Lesson count mismatch!")
            return 1
        
        print("\n" + "=" * 80)
        print("Detailed Comparison:")
        print("=" * 80)
        
        all_match = True
        
        for i, expected in enumerate(EXPECTED_LESSONS):
            db_lesson = db_lessons[i]
            db_id, db_module, db_order, db_title, db_content_len = db_lesson
            
            # Check module
            module_match = db_module == expected["module"]
            # Check order
            order_match = db_order == expected["order"]
            # Check title
            title_match = db_title == expected["title"]
            # Check content exists
            has_content = db_content_len > 0
            
            status = "✓" if (module_match and order_match and title_match and has_content) else "✗"
            
            print(f"\n{status} Lesson {expected['id']}: {expected['title']}")
            print(f"   Module: {db_module} (expected: {expected['module']}) {'✓' if module_match else '✗'}")
            print(f"   Order: {db_order} (expected: {expected['order']}) {'✓' if order_match else '✗'}")
            print(f"   Title: {db_title} {'✓' if title_match else '✗'}")
            print(f"   Content: {db_content_len} characters {'✓' if has_content else '✗'}")
            
            if not (module_match and order_match and title_match and has_content):
                all_match = False
        
        print("\n" + "=" * 80)
        
        if all_match:
            print("✓ All lessons match! Migration successful!")
        else:
            print("✗ Some lessons don't match. Please review.")
            return 1
        
        print("=" * 80)
        
    except Exception as e:
        print(f"\n✗ Comparison failed: {e}")
        return 1
    finally:
        db.close()
    
    return 0


if __name__ == "__main__":
    sys.exit(compare_lessons())
