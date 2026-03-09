#!/usr/bin/env python3
"""
Verification Script: Check migration 002 results
Queries the database to verify the lesson content tables are properly set up
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text, inspect
from app.database import engine


def main():
    """Verify migration 002 results"""
    print("=" * 70)
    print("Verifying Migration 002: Lesson Content Tables")
    print("=" * 70)
    
    with engine.connect() as connection:
        # Check table structures
        inspector = inspect(engine)
        
        tables = ['lesson_content', 'lesson_objectives', 'lesson_prerequisites']
        
        for table_name in tables:
            print(f"\n{table_name.upper()}:")
            print("-" * 70)
            
            # Get columns
            columns = inspector.get_columns(table_name)
            print(f"Columns ({len(columns)}):")
            for col in columns:
                nullable = "NULL" if col['nullable'] else "NOT NULL"
                print(f"  - {col['name']}: {col['type']} {nullable}")
            
            # Get foreign keys
            foreign_keys = inspector.get_foreign_keys(table_name)
            if foreign_keys:
                print(f"\nForeign Keys ({len(foreign_keys)}):")
                for fk in foreign_keys:
                    print(f"  - {fk['constrained_columns']} → {fk['referred_table']}.{fk['referred_columns']}")
            
            # Get indexes
            indexes = inspector.get_indexes(table_name)
            if indexes:
                print(f"\nIndexes ({len(indexes)}):")
                for idx in indexes:
                    unique = "UNIQUE" if idx['unique'] else ""
                    print(f"  - {idx['name']}: {idx['column_names']} {unique}")
        
        print("\n" + "=" * 70)
        print("✓ VERIFICATION COMPLETE")
        print("=" * 70)


if __name__ == "__main__":
    main()
