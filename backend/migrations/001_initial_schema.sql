-- ============================================================================
-- Plataforma Educativa de Python para Análisis Financiero
-- Initial Database Schema Migration
-- ============================================================================
-- This script creates all tables, indexes, and constraints for the platform
-- Execute this in Supabase SQL Editor after creating your project
-- ============================================================================

-- ============================================================================
-- TABLES
-- ============================================================================

-- Semestres (Academic periods)
CREATE TABLE semesters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'archived')),
    duration_weeks INTEGER GENERATED ALWAYS AS (
        EXTRACT(WEEK FROM end_date) - EXTRACT(WEEK FROM start_date)
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuarios (Students and Professors)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'professor')),
    semester_id INTEGER REFERENCES semesters(id),
    github_token TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invitaciones (Registration invitations)
CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    semester_id INTEGER REFERENCES semesters(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('sent', 'registered', 'pending')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Equipos (Student teams)
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    semester_id INTEGER REFERENCES semesters(id),
    repository_url TEXT,
    leader_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Miembros de equipo (Team membership)
CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, user_id)
);

-- Módulos (Course modules)
CREATE TABLE modules (
    id SERIAL PRIMARY KEY,
    number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_weeks INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    prerequisites INTEGER[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lecciones (Lessons within modules)
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    code_template TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ejercicios (Practice exercises)
CREATE TABLE exercises (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id),
    lesson_id INTEGER REFERENCES lessons(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    starter_code TEXT,
    test_cases JSONB NOT NULL,
    hints JSONB,
    points INTEGER DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Submisiones de ejercicios (Exercise submissions)
CREATE TABLE exercise_submissions (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER REFERENCES exercises(id),
    user_id INTEGER REFERENCES users(id),
    code TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('correct', 'incorrect', 'pending')),
    output TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    execution_time_ms INTEGER
);

-- Entregas de proyecto (Project submissions)
CREATE TABLE project_submissions (
    id SERIAL PRIMARY KEY,
    team_id INTEGER REFERENCES teams(id),
    semester_id INTEGER REFERENCES semesters(id),
    submission_type VARCHAR(50) CHECK (submission_type IN ('trabajo_1', 'trabajo_2', 'concurso', 'examen')),
    notebook_url TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'graded')),
    grade DECIMAL(5,2),
    feedback TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    is_late BOOLEAN DEFAULT FALSE
);

-- Confirmaciones de entrega (Submission confirmations by team members)
CREATE TABLE submission_confirmations (
    id SERIAL PRIMARY KEY,
    submission_id INTEGER REFERENCES project_submissions(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id),
    confirmed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(submission_id, user_id)
);

-- Calificaciones (Grades with automatic final grade calculation)
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    semester_id INTEGER REFERENCES semesters(id),
    trabajo_1 DECIMAL(5,2),
    trabajo_2 DECIMAL(5,2),
    concurso DECIMAL(5,2),
    examen DECIMAL(5,2),
    seguimiento DECIMAL(5,2),
    final_grade DECIMAL(5,2) GENERATED ALWAYS AS (
        (COALESCE(trabajo_1, 0) * 0.20) +
        (COALESCE(trabajo_2, 0) * 0.20) +
        (COALESCE(concurso, 0) * 0.20) +
        (COALESCE(examen, 0) * 0.20) +
        (COALESCE(seguimiento, 0) * 0.20)
    ) STORED,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, semester_id)
);

-- Progreso del estudiante (Student progress tracking)
CREATE TABLE student_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    module_id INTEGER REFERENCES modules(id),
    exercises_completed INTEGER DEFAULT 0,
    exercises_total INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN exercises_total > 0 
        THEN (exercises_completed::DECIMAL / exercises_total * 100)
        ELSE 0 END
    ) STORED,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, module_id)
);

-- Actividad de código (Code execution activity tracking)
CREATE TABLE code_activity (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    code_snippet TEXT,
    execution_count INTEGER DEFAULT 1,
    last_executed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insignias (Achievement badges)
CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB NOT NULL,
    points INTEGER DEFAULT 0
);

-- Insignias de usuario (User earned badges)
CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    badge_id INTEGER REFERENCES badges(id),
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, badge_id)
);

-- Puntos de experiencia (Experience points tracking)
CREATE TABLE experience_points (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    points INTEGER DEFAULT 0,
    source VARCHAR(50) NOT NULL,
    description TEXT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ============================================================================

-- Users table indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_semester ON users(semester_id);
CREATE INDEX idx_users_role ON users(role);

-- Teams table indexes
CREATE INDEX idx_teams_semester ON teams(semester_id);
CREATE INDEX idx_teams_leader ON teams(leader_id);

-- Team members indexes
CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- Exercise submissions indexes
CREATE INDEX idx_exercise_submissions_user ON exercise_submissions(user_id);
CREATE INDEX idx_exercise_submissions_exercise ON exercise_submissions(exercise_id);
CREATE INDEX idx_exercise_submissions_status ON exercise_submissions(status);

-- Project submissions indexes
CREATE INDEX idx_project_submissions_team ON project_submissions(team_id);
CREATE INDEX idx_project_submissions_semester ON project_submissions(semester_id);
CREATE INDEX idx_project_submissions_type ON project_submissions(submission_type);
CREATE INDEX idx_project_submissions_status ON project_submissions(status);

-- Student progress indexes
CREATE INDEX idx_student_progress_user ON student_progress(user_id);
CREATE INDEX idx_student_progress_module ON student_progress(module_id);

-- Grades indexes
CREATE INDEX idx_grades_user_semester ON grades(user_id, semester_id);
CREATE INDEX idx_grades_semester ON grades(semester_id);

-- Code activity indexes
CREATE INDEX idx_code_activity_user ON code_activity(user_id);
CREATE INDEX idx_code_activity_last_executed ON code_activity(last_executed);

-- Invitations indexes
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_semester ON invitations(semester_id);
CREATE INDEX idx_invitations_status ON invitations(status);

-- Experience points indexes
CREATE INDEX idx_experience_points_user ON experience_points(user_id);

-- User badges indexes
CREATE INDEX idx_user_badges_user ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge ON user_badges(badge_id);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE semesters IS 'Academic periods with automatic duration calculation';
COMMENT ON TABLE users IS 'Students and professors with institutional email validation';
COMMENT ON TABLE invitations IS 'Registration invitations with expiration tokens';
COMMENT ON TABLE teams IS 'Student teams (2-4 members) for collaborative projects';
COMMENT ON TABLE team_members IS 'Team membership with join timestamps';
COMMENT ON TABLE modules IS 'Course modules with prerequisites';
COMMENT ON TABLE lessons IS 'Individual lessons within modules';
COMMENT ON TABLE exercises IS 'Practice exercises with automatic validation';
COMMENT ON TABLE exercise_submissions IS 'Student exercise submissions with execution tracking';
COMMENT ON TABLE project_submissions IS 'Team project submissions (Trabajo_1, Trabajo_2, Concurso, Examen)';
COMMENT ON TABLE submission_confirmations IS 'Team member confirmations for project submissions';
COMMENT ON TABLE grades IS 'Student grades with automatic final grade calculation (20% each component)';
COMMENT ON TABLE student_progress IS 'Student progress tracking with automatic completion percentage';
COMMENT ON TABLE code_activity IS 'Code execution activity for seguimiento calculation';
COMMENT ON TABLE badges IS 'Achievement badges with criteria';
COMMENT ON TABLE user_badges IS 'User earned badges';
COMMENT ON TABLE experience_points IS 'Experience points from various sources';

COMMENT ON COLUMN semesters.duration_weeks IS 'Automatically calculated from start_date and end_date';
COMMENT ON COLUMN grades.final_grade IS 'Automatically calculated as weighted average (20% each component)';
COMMENT ON COLUMN student_progress.completion_percentage IS 'Automatically calculated from exercises_completed/exercises_total';

-- ============================================================================
-- INITIAL DATA (Optional - can be added later)
-- ============================================================================

-- Insert default badges (uncomment to add initial badges)
/*
INSERT INTO badges (name, description, criteria, points) VALUES
('Primera Ejecución', 'Ejecutaste tu primer código Python', '{"type": "first_execution"}', 10),
('10 Ejercicios', 'Completaste 10 ejercicios', '{"type": "exercises_completed", "count": 10}', 50),
('Módulo Completo', 'Completaste un módulo completo', '{"type": "module_completed"}', 100),
('Entrega a Tiempo', 'Entregaste un proyecto antes de la fecha límite', '{"type": "on_time_submission"}', 75),
('Racha de 7 Días', 'Usaste la plataforma 7 días consecutivos', '{"type": "streak", "days": 7}', 150);
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries after migration to verify the schema:

-- Check all tables were created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Check all indexes were created
-- SELECT indexname, tablename FROM pg_indexes WHERE schemaname = 'public' ORDER BY tablename, indexname;

-- Check constraints
-- SELECT conname, contype, conrelid::regclass FROM pg_constraint WHERE connamespace = 'public'::regnamespace;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
