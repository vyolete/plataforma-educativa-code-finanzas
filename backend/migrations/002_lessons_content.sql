-- ============================================================================
-- Plataforma Educativa de Python para Análisis Financiero
-- Lesson Content Migration - Phase 6: Content Migration to Supabase
-- ============================================================================
-- This migration creates tables for storing lesson content, objectives, and
-- prerequisites in the database instead of TypeScript code.
-- 
-- Purpose: Move 2660+ lines of educational content from lessons.ts to database
-- Impact: Build time becomes independent of content volume
-- ============================================================================

-- ============================================================================
-- LESSON CONTENT TABLES
-- ============================================================================

-- Lesson content table (stores rich content blocks)
CREATE TABLE IF NOT EXISTS lesson_content (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('theory', 'example', 'exercise', 'tip', 'warning', 'code')),
    content_order INTEGER NOT NULL,
    title VARCHAR(200),
    markdown_content TEXT NOT NULL,
    code_example TEXT,
    code_language VARCHAR(20) DEFAULT 'python',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, content_order)
);

-- Lesson objectives table (learning objectives for each lesson)
CREATE TABLE IF NOT EXISTS lesson_objectives (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    objective_text TEXT NOT NULL,
    objective_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, objective_order)
);

-- Lesson prerequisites table (lesson dependencies)
CREATE TABLE IF NOT EXISTS lesson_prerequisites (
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    prerequisite_lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lesson_id, prerequisite_lesson_id),
    CHECK (lesson_id != prerequisite_lesson_id)
);

-- ============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================

-- Lesson content indexes
CREATE INDEX IF NOT EXISTS idx_lesson_content_lesson_id ON lesson_content(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_content_order ON lesson_content(lesson_id, content_order);
CREATE INDEX IF NOT EXISTS idx_lesson_content_type ON lesson_content(content_type);

-- Lesson objectives indexes
CREATE INDEX IF NOT EXISTS idx_lesson_objectives_lesson_id ON lesson_objectives(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_objectives_order ON lesson_objectives(lesson_id, objective_order);

-- Lesson prerequisites indexes
CREATE INDEX IF NOT EXISTS idx_lesson_prerequisites_lesson ON lesson_prerequisites(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_prerequisites_prereq ON lesson_prerequisites(prerequisite_lesson_id);

-- Lessons table indexes (enhance existing table)
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(module_id, order_index);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE lesson_content IS 'Rich content blocks for lessons (theory, examples, code, tips)';
COMMENT ON TABLE lesson_objectives IS 'Learning objectives for each lesson';
COMMENT ON TABLE lesson_prerequisites IS 'Lesson dependencies (which lessons must be completed first)';

COMMENT ON COLUMN lesson_content.content_type IS 'Type of content: theory, example, exercise, tip, warning, code';
COMMENT ON COLUMN lesson_content.content_order IS 'Order of content blocks within the lesson';
COMMENT ON COLUMN lesson_content.markdown_content IS 'Main content in Markdown format';
COMMENT ON COLUMN lesson_content.code_example IS 'Optional code example associated with this content block';
COMMENT ON COLUMN lesson_content.code_language IS 'Programming language for code_example (default: python)';

COMMENT ON COLUMN lesson_objectives.objective_text IS 'Learning objective description';
COMMENT ON COLUMN lesson_objectives.objective_order IS 'Display order of objectives';

COMMENT ON COLUMN lesson_prerequisites.lesson_id IS 'Lesson that has prerequisites';
COMMENT ON COLUMN lesson_prerequisites.prerequisite_lesson_id IS 'Lesson that must be completed first';

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for lesson_content
DROP TRIGGER IF EXISTS update_lesson_content_updated_at ON lesson_content;
CREATE TRIGGER update_lesson_content_updated_at
    BEFORE UPDATE ON lesson_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries after migration to verify the schema:

-- Check all tables were created
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name LIKE 'lesson%' 
-- ORDER BY table_name;

-- Check all indexes were created
-- SELECT indexname, tablename FROM pg_indexes 
-- WHERE schemaname = 'public' AND tablename LIKE 'lesson%' 
-- ORDER BY tablename, indexname;

-- Check foreign key constraints
-- SELECT conname, conrelid::regclass, confrelid::regclass 
-- FROM pg_constraint 
-- WHERE contype = 'f' AND conrelid::regclass::text LIKE 'lesson%';

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Uncomment to insert sample lesson content for testing:
/*
-- Sample lesson content
INSERT INTO lesson_content (lesson_id, content_type, content_order, title, markdown_content, code_example) VALUES
(1, 'theory', 1, 'Introducción a Python', 'Python es un lenguaje de programación de alto nivel...', NULL),
(1, 'code', 2, 'Primer programa', 'Veamos un ejemplo simple:', 'print("Hola, mundo!")'),
(1, 'tip', 3, 'Consejo', 'Usa print() para ver resultados en la consola.', NULL);

-- Sample lesson objectives
INSERT INTO lesson_objectives (lesson_id, objective_text, objective_order) VALUES
(1, 'Comprender qué es Python y para qué se usa', 1),
(1, 'Escribir y ejecutar tu primer programa en Python', 2),
(1, 'Entender la sintaxis básica de Python', 3);

-- Sample lesson prerequisites
INSERT INTO lesson_prerequisites (lesson_id, prerequisite_lesson_id) VALUES
(2, 1),  -- Lesson 2 requires Lesson 1
(3, 2);  -- Lesson 3 requires Lesson 2
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Execute this migration in Supabase SQL Editor
-- 2. Verify tables are created correctly using verification queries
-- 3. Run migration script to populate data from lessons.ts
-- 4. Update backend API to serve lesson content from database
-- 5. Update frontend to fetch lessons via API instead of static imports
-- ============================================================================
