-- Migration: Add hint_usage table for tracking student hint usage
-- Date: 2024
-- Description: Track when students use hints to understand which exercises are challenging

-- Create hint_usage table
CREATE TABLE IF NOT EXISTS hint_usage (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    hint_level INTEGER NOT NULL CHECK (hint_level >= 1 AND hint_level <= 3),
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes for performance
    CONSTRAINT hint_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT hint_usage_exercise_id_fkey FOREIGN KEY (exercise_id) REFERENCES exercises(id)
);

-- Create indexes
CREATE INDEX idx_hint_usage_user_id ON hint_usage(user_id);
CREATE INDEX idx_hint_usage_exercise_id ON hint_usage(exercise_id);
CREATE INDEX idx_hint_usage_used_at ON hint_usage(used_at);

-- Add comment
COMMENT ON TABLE hint_usage IS 'Tracks when students use hints for exercises';
COMMENT ON COLUMN hint_usage.hint_level IS 'Hint level used: 1 (conceptual), 2 (example), 3 (structure)';
