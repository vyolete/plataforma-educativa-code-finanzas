#!/usr/bin/env python3
"""
Migration script to move lesson data from lessons.ts to Supabase database.

This script:
1. Reads the TypeScript lessons.ts file
2. Parses lesson objects using regex patterns
3. Inserts lessons into the database tables:
   - lessons (main lesson data)
   - lesson_content (rich content blocks)
   - lesson_objectives (learning objectives)

Usage:
    python backend/scripts/migrate_lessons_to_db.py

Requirements:
    - Database connection configured in backend/.env
    - Migration 002_lessons_content.sql already executed
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Any, Optional

# Add backend directory to path for imports
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import SessionLocal, engine
from app.config import settings


class LessonParser:
    """Parser for TypeScript lesson files."""
    
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.content = self._read_file()
    
    def _read_file(self) -> str:
        """Read the TypeScript file."""
        with open(self.file_path, 'r', encoding='utf-8') as f:
            return f.read()
    
    def parse_lessons(self) -> List[Dict[str, Any]]:
        """
        Parse lessons from TypeScript file.
        
        The lessons.ts file has a simple structure:
        - sampleLessonsBase: Lesson[] array
        - Each lesson has: id, moduleId, title, content, orderIndex
        """
        lessons = []
        
        # Find the sampleLessonsBase array
        # Pattern: const sampleLessonsBase: Lesson[] = [...]
        base_pattern = r'const sampleLessonsBase: Lesson\[\] = \[(.*?)\];'
        base_match = re.search(base_pattern, self.content, re.DOTALL)
        
        if base_match:
            base_content = base_match.group(1)
            lessons.extend(self._parse_lesson_objects(base_content))
        
        print(f"Parsed {len(lessons)} lessons from sampleLessonsBase")
        return lessons
    
    def _parse_lesson_objects(self, content: str) -> List[Dict[str, Any]]:
        """Parse individual lesson objects from array content."""
        lessons = []
        
        # Split by lesson objects (each starts with { and ends with })
        # We need to handle nested braces in content
        lesson_objects = self._extract_objects(content)
        
        for obj_str in lesson_objects:
            lesson = self._parse_single_lesson(obj_str)
            if lesson:
                lessons.append(lesson)
        
        return lessons
    
    def _extract_objects(self, content: str) -> List[str]:
        """Extract individual object strings from array content."""
        objects = []
        current_obj = []
        brace_count = 0
        in_string = False
        escape_next = False
        string_char = None
        
        for char in content:
            if escape_next:
                current_obj.append(char)
                escape_next = False
                continue
            
            if char == '\\':
                escape_next = True
                current_obj.append(char)
                continue
            
            if char in ('"', "'", '`') and not in_string:
                in_string = True
                string_char = char
                current_obj.append(char)
            elif char == string_char and in_string:
                in_string = False
                string_char = None
                current_obj.append(char)
            elif char == '{' and not in_string:
                brace_count += 1
                current_obj.append(char)
            elif char == '}' and not in_string:
                brace_count -= 1
                current_obj.append(char)
                if brace_count == 0 and current_obj:
                    objects.append(''.join(current_obj))
                    current_obj = []
            else:
                if brace_count > 0:
                    current_obj.append(char)
        
        return objects
    
    def _parse_single_lesson(self, obj_str: str) -> Optional[Dict[str, Any]]:
        """Parse a single lesson object string."""
        try:
            lesson = {}
            
            # Extract id
            id_match = re.search(r"id:\s*['\"]([^'\"]+)['\"]", obj_str)
            if id_match:
                lesson['id'] = id_match.group(1)
            
            # Extract moduleId
            module_match = re.search(r"moduleId:\s*['\"]([^'\"]+)['\"]", obj_str)
            if module_match:
                lesson['moduleId'] = module_match.group(1)
            
            # Extract title
            title_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", obj_str)
            if title_match:
                lesson['title'] = title_match.group(1)
            
            # Extract orderIndex
            order_match = re.search(r"orderIndex:\s*(\d+)", obj_str)
            if order_match:
                lesson['orderIndex'] = int(order_match.group(1))
            
            # Extract content (this is tricky due to template literals)
            # Content is between content: ` and the closing `
            content_match = re.search(r"content:\s*`(.*?)`\s*\}", obj_str, re.DOTALL)
            if content_match:
                lesson['content'] = content_match.group(1)
            
            # Validate required fields
            if all(k in lesson for k in ['id', 'moduleId', 'title', 'orderIndex', 'content']):
                return lesson
            else:
                print(f"Warning: Incomplete lesson object, missing fields: {set(['id', 'moduleId', 'title', 'orderIndex', 'content']) - set(lesson.keys())}")
                return None
        
        except Exception as e:
            print(f"Error parsing lesson object: {e}")
            return None
    
    def parse_module3_lessons(self, module3_file: str) -> List[Dict[str, Any]]:
        """Parse lessons from module3-lessons.ts file."""
        try:
            with open(module3_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Find the module3Lessons array
            pattern = r'export const module3Lessons: Lesson\[\] = \[(.*?)\];'
            match = re.search(pattern, content, re.DOTALL)
            
            if match:
                array_content = match.group(1)
                lessons = self._parse_lesson_objects(array_content)
                print(f"Parsed {len(lessons)} lessons from module3-lessons.ts")
                return lessons
            else:
                print("Warning: Could not find module3Lessons array")
                return []
        
        except FileNotFoundError:
            print(f"Warning: module3-lessons.ts not found at {module3_file}")
            return []
        except Exception as e:
            print(f"Error parsing module3-lessons.ts: {e}")
            return []


class LessonMigrator:
    """Migrates lesson data to database."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def migrate_lessons(self, lessons: List[Dict[str, Any]]) -> None:
        """
        Migrate lessons to database.
        
        For each lesson:
        1. Ensure module exists
        2. Insert into lessons table
        3. Parse content and insert into lesson_content table
        4. Extract objectives and insert into lesson_objectives table
        """
        print(f"\nStarting migration of {len(lessons)} lessons...")
        
        # First, ensure all required modules exist
        self._ensure_modules_exist(lessons)
        
        success_count = 0
        error_count = 0
        
        for lesson_data in lessons:
            try:
                self._migrate_single_lesson(lesson_data)
                success_count += 1
                print(f"✓ Migrated lesson {lesson_data['id']}: {lesson_data['title']}")
            except Exception as e:
                error_count += 1
                print(f"✗ Error migrating lesson {lesson_data.get('id', 'unknown')}: {e}")
        
        # Commit all changes
        try:
            self.db.commit()
            print(f"\n✓ Migration completed: {success_count} successful, {error_count} errors")
        except Exception as e:
            self.db.rollback()
            print(f"\n✗ Migration failed during commit: {e}")
            raise
    
    def _ensure_modules_exist(self, lessons: List[Dict[str, Any]]) -> None:
        """Ensure all required modules exist in the database."""
        # Get unique module IDs from lessons
        module_ids = set(int(lesson['moduleId']) for lesson in lessons)
        
        print(f"\nEnsuring modules exist for: {sorted(module_ids)}")
        
        # Module definitions (based on course structure)
        module_definitions = {
            1: {
                'number': 1,
                'title': 'Fundamentos de Python',
                'description': 'Introducción a Python: variables, tipos de datos, operadores y control de flujo',
                'duration_weeks': 2,
                'order_index': 1
            },
            2: {
                'number': 2,
                'title': 'Estructuras de Datos',
                'description': 'Listas, tuplas, diccionarios, conjuntos y strings',
                'duration_weeks': 2,
                'order_index': 2
            },
            3: {
                'number': 3,
                'title': 'Introducción a Pandas',
                'description': 'DataFrames, Series y manipulación de datos tabulares',
                'duration_weeks': 2,
                'order_index': 3
            },
            4: {
                'number': 4,
                'title': 'Análisis de Datos Financieros',
                'description': 'Análisis de series temporales y datos financieros con Pandas',
                'duration_weeks': 2,
                'order_index': 4
            },
            5: {
                'number': 5,
                'title': 'Visualización de Datos',
                'description': 'Matplotlib y visualización de datos financieros',
                'duration_weeks': 2,
                'order_index': 5
            },
            6: {
                'number': 6,
                'title': 'Análisis Estadístico',
                'description': 'Estadística descriptiva e inferencial con Python',
                'duration_weeks': 2,
                'order_index': 6
            },
            7: {
                'number': 7,
                'title': 'Modelos Financieros',
                'description': 'Modelos de valoración y análisis de riesgo',
                'duration_weeks': 2,
                'order_index': 7
            },
            8: {
                'number': 8,
                'title': 'Proyecto Final',
                'description': 'Integración de conceptos en un proyecto de análisis financiero',
                'duration_weeks': 2,
                'order_index': 8
            }
        }
        
        for module_id in module_ids:
            # Check if module exists
            existing = self.db.execute(
                text("SELECT id FROM modules WHERE id = :module_id"),
                {"module_id": module_id}
            ).fetchone()
            
            if not existing:
                # Create module
                module_def = module_definitions.get(module_id, {
                    'number': module_id,
                    'title': f'Módulo {module_id}',
                    'description': f'Módulo {module_id}',
                    'duration_weeks': 2,
                    'order_index': module_id
                })
                
                self.db.execute(
                    text("""
                        INSERT INTO modules (id, number, title, description, duration_weeks, order_index)
                        VALUES (:id, :number, :title, :description, :duration_weeks, :order_index)
                    """),
                    {
                        'id': module_id,
                        'number': module_def['number'],
                        'title': module_def['title'],
                        'description': module_def['description'],
                        'duration_weeks': module_def['duration_weeks'],
                        'order_index': module_def['order_index']
                    }
                )
                print(f"  ✓ Created module {module_id}: {module_def['title']}")
            else:
                print(f"  ✓ Module {module_id} already exists")
    
    def _migrate_single_lesson(self, lesson_data: Dict[str, Any]) -> None:
        """Migrate a single lesson to database."""
        lesson_id = lesson_data['id']  # String ID like "1-1" (for reference only)
        module_id = int(lesson_data['moduleId'])
        order_index = lesson_data['orderIndex']
        
        # Check if lesson already exists (by module_id and order_index, not string ID)
        existing = self.db.execute(
            text("SELECT id FROM lessons WHERE module_id = :module_id AND order_index = :order_index"),
            {"module_id": module_id, "order_index": order_index}
        ).fetchone()
        
        if existing:
            print(f"  Lesson {lesson_id} (module {module_id}, order {order_index}) already exists, skipping...")
            return
        
        # Insert main lesson record
        # Note: The lessons table uses SERIAL id, but we need to map string IDs
        # We'll use the numeric part of the ID (e.g., "1-1" -> module 1, order 1)
        self.db.execute(
            text("""
                INSERT INTO lessons (module_id, title, content, order_index)
                VALUES (:module_id, :title, :content, :order_index)
            """),
            {
                "module_id": module_id,
                "title": lesson_data['title'],
                "content": lesson_data['content'],
                "order_index": lesson_data['orderIndex']
            }
        )
        
        # Get the inserted lesson's database ID
        result = self.db.execute(
            text("""
                SELECT id FROM lessons 
                WHERE module_id = :module_id 
                AND order_index = :order_index
                ORDER BY id DESC LIMIT 1
            """),
            {
                "module_id": module_id,
                "order_index": lesson_data['orderIndex']
            }
        )
        db_lesson_id = result.fetchone()[0]
        
        # Parse content and extract structured data
        content = lesson_data['content']
        
        # Extract objectives (lines starting with "- " after "¿Qué aprenderás?")
        objectives = self._extract_objectives(content)
        if objectives:
            for idx, objective in enumerate(objectives):
                self.db.execute(
                    text("""
                        INSERT INTO lesson_objectives (lesson_id, objective_text, objective_order)
                        VALUES (:lesson_id, :objective_text, :objective_order)
                    """),
                    {
                        "lesson_id": db_lesson_id,
                        "objective_text": objective,
                        "objective_order": idx
                    }
                )
        
        # Parse content into structured blocks
        content_blocks = self._parse_content_blocks(content)
        for idx, block in enumerate(content_blocks):
            self.db.execute(
                text("""
                    INSERT INTO lesson_content 
                    (lesson_id, content_type, content_order, title, markdown_content, code_example, code_language)
                    VALUES (:lesson_id, :content_type, :content_order, :title, :markdown_content, :code_example, :code_language)
                """),
                {
                    "lesson_id": db_lesson_id,
                    "content_type": block['type'],
                    "content_order": idx,
                    "title": block.get('title'),
                    "markdown_content": block['content'],
                    "code_example": block.get('code'),
                    "code_language": block.get('language', 'python')
                }
            )
    
    def _extract_objectives(self, content: str) -> List[str]:
        """Extract learning objectives from content."""
        objectives = []
        
        # Find the "¿Qué aprenderás?" section
        match = re.search(r'## ¿Qué aprenderás\?(.*?)##', content, re.DOTALL)
        if match:
            section = match.group(1)
            # Extract bullet points
            for line in section.split('\n'):
                line = line.strip()
                if line.startswith('- '):
                    objectives.append(line[2:].strip())
        
        return objectives
    
    def _parse_content_blocks(self, content: str) -> List[Dict[str, Any]]:
        """
        Parse content into structured blocks.
        
        Identifies:
        - Theory sections (regular text)
        - Code examples (```python blocks)
        - Tips/warnings (special markers)
        """
        blocks = []
        
        # Split content by sections (## headers)
        sections = re.split(r'\n## ', content)
        
        for section in sections:
            if not section.strip():
                continue
            
            # Extract section title
            lines = section.split('\n', 1)
            title = lines[0].strip('#').strip()
            section_content = lines[1] if len(lines) > 1 else ''
            
            # Check for code blocks
            code_blocks = re.findall(r'```(\w+)?\n(.*?)```', section_content, re.DOTALL)
            
            if code_blocks:
                # Section has code - split into text and code
                parts = re.split(r'```\w*\n.*?```', section_content, flags=re.DOTALL)
                
                for i, text_part in enumerate(parts):
                    if text_part.strip():
                        blocks.append({
                            'type': 'theory',
                            'title': title if i == 0 else None,
                            'content': text_part.strip()
                        })
                    
                    if i < len(code_blocks):
                        lang, code = code_blocks[i]
                        blocks.append({
                            'type': 'code',
                            'title': None,
                            'content': f"Code example in {lang or 'python'}",
                            'code': code.strip(),
                            'language': lang or 'python'
                        })
            else:
                # Pure text section
                blocks.append({
                    'type': 'theory',
                    'title': title,
                    'content': section_content.strip()
                })
        
        return blocks


def main():
    """Main migration function."""
    print("=" * 80)
    print("Lesson Data Migration Script")
    print("=" * 80)
    
    # Check database connection
    print("\n1. Checking database connection...")
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("   ✓ Database connection successful")
    except Exception as e:
        print(f"   ✗ Database connection failed: {e}")
        print("\nPlease check your DATABASE_URL in backend/.env")
        return 1
    
    # Check if migration 002 has been run
    print("\n2. Checking if lesson_content tables exist...")
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = 'lesson_content'
                )
            """))
            exists = result.fetchone()[0]
            
            if not exists:
                print("   ✗ lesson_content table does not exist")
                print("\nPlease run migration 002_lessons_content.sql first:")
                print("   python backend/scripts/run_migration_002.py")
                return 1
            
            print("   ✓ lesson_content tables exist")
    except Exception as e:
        print(f"   ✗ Error checking tables: {e}")
        return 1
    
    # Parse lessons from TypeScript files
    print("\n3. Parsing lessons from TypeScript files...")
    
    # Get paths relative to project root
    project_root = Path(__file__).parent.parent.parent
    lessons_file = project_root / "frontend/src/data/lessons.ts"
    module3_file = project_root / "frontend/src/data/module3-lessons.ts"
    
    lessons_file = str(lessons_file)
    module3_file = str(module3_file)
    
    if not os.path.exists(lessons_file):
        print(f"   ✗ File not found: {lessons_file}")
        return 1
    
    parser = LessonParser(lessons_file)
    lessons = parser.parse_lessons()
    
    # Parse module 3 lessons
    if os.path.exists(module3_file):
        module3_lessons = parser.parse_module3_lessons(module3_file)
        lessons.extend(module3_lessons)
    
    print(f"   ✓ Total lessons parsed: {len(lessons)}")
    
    if not lessons:
        print("   ✗ No lessons found to migrate")
        return 1
    
    # Migrate to database
    print("\n4. Migrating lessons to database...")
    db = SessionLocal()
    try:
        migrator = LessonMigrator(db)
        migrator.migrate_lessons(lessons)
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        return 1
    finally:
        db.close()
    
    # Verify migration
    print("\n5. Verifying migration...")
    db = SessionLocal()
    try:
        result = db.execute(text("SELECT COUNT(*) FROM lessons"))
        lesson_count = result.fetchone()[0]
        
        result = db.execute(text("SELECT COUNT(*) FROM lesson_content"))
        content_count = result.fetchone()[0]
        
        result = db.execute(text("SELECT COUNT(*) FROM lesson_objectives"))
        objectives_count = result.fetchone()[0]
        
        print(f"   ✓ Lessons in database: {lesson_count}")
        print(f"   ✓ Content blocks: {content_count}")
        print(f"   ✓ Objectives: {objectives_count}")
    except Exception as e:
        print(f"   ✗ Verification failed: {e}")
        return 1
    finally:
        db.close()
    
    print("\n" + "=" * 80)
    print("✓ Migration completed successfully!")
    print("=" * 80)
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
