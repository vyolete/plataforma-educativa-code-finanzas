# Database Schema Reference

Quick reference guide for the Plataforma Educativa database schema.

## Table Relationships Diagram

```
semesters
    ├── users (semester_id)
    ├── invitations (semester_id)
    ├── teams (semester_id)
    └── project_submissions (semester_id)

users
    ├── teams (via team_members)
    ├── exercise_submissions (user_id)
    ├── grades (user_id)
    ├── student_progress (user_id)
    ├── code_activity (user_id)
    ├── user_badges (user_id)
    └── experience_points (user_id)

teams
    ├── team_members (team_id)
    ├── project_submissions (team_id)
    └── leader → users (leader_id)

modules
    ├── lessons (module_id)
    ├── exercises (module_id)
    └── student_progress (module_id)

exercises
    └── exercise_submissions (exercise_id)

project_submissions
    └── submission_confirmations (submission_id)

badges
    └── user_badges (badge_id)
```

## Core Tables

### users
Students and professors with institutional authentication.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| email | VARCHAR(255) | Institutional email (@correo.itm.edu.co) |
| password_hash | VARCHAR(255) | Hashed password |
| full_name | VARCHAR(255) | Full name |
| role | VARCHAR(20) | 'student' or 'professor' |
| semester_id | INTEGER | FK to semesters |
| github_token | TEXT | GitHub OAuth token (encrypted) |
| created_at | TIMESTAMP | Account creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

**Constraints:**
- UNIQUE(email)
- CHECK(role IN ('student', 'professor'))

**Indexes:**
- idx_users_email
- idx_users_semester
- idx_users_role

---

### semesters
Academic periods with automatic duration calculation.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Semester name (e.g., "2024-1") |
| start_date | DATE | Semester start date |
| end_date | DATE | Semester end date |
| status | VARCHAR(20) | 'active' or 'archived' |
| duration_weeks | INTEGER | **COMPUTED**: weeks between dates |
| created_at | TIMESTAMP | Creation timestamp |

**Constraints:**
- CHECK(status IN ('active', 'archived'))

**Computed Columns:**
- `duration_weeks = EXTRACT(WEEK FROM end_date) - EXTRACT(WEEK FROM start_date)`

---

### invitations
Registration invitations with expiration tokens.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| email | VARCHAR(255) | Invited email address |
| semester_id | INTEGER | FK to semesters |
| token | VARCHAR(255) | Unique invitation token (UUID) |
| status | VARCHAR(20) | 'sent', 'registered', or 'pending' |
| created_at | TIMESTAMP | Creation timestamp |
| expires_at | TIMESTAMP | Expiration timestamp |

**Constraints:**
- UNIQUE(token)
- CHECK(status IN ('sent', 'registered', 'pending'))

**Indexes:**
- idx_invitations_email
- idx_invitations_token
- idx_invitations_semester
- idx_invitations_status

---

### teams
Student teams for collaborative projects (2-4 members).

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Team name |
| semester_id | INTEGER | FK to semesters |
| repository_url | TEXT | GitHub repository URL |
| leader_id | INTEGER | FK to users (team leader) |
| created_at | TIMESTAMP | Creation timestamp |

**Indexes:**
- idx_teams_semester
- idx_teams_leader

---

### team_members
Team membership junction table.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| team_id | INTEGER | FK to teams (CASCADE DELETE) |
| user_id | INTEGER | FK to users |
| joined_at | TIMESTAMP | Join timestamp |

**Constraints:**
- UNIQUE(team_id, user_id)

**Indexes:**
- idx_team_members_team
- idx_team_members_user

---

### modules
Course modules with prerequisites.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| number | INTEGER | Module number (1-8) |
| title | VARCHAR(255) | Module title |
| description | TEXT | Module description |
| duration_weeks | INTEGER | Expected duration in weeks |
| order_index | INTEGER | Display order |
| prerequisites | INTEGER[] | Array of prerequisite module IDs |
| created_at | TIMESTAMP | Creation timestamp |

---

### lessons
Individual lessons within modules.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| module_id | INTEGER | FK to modules |
| title | VARCHAR(255) | Lesson title |
| content | TEXT | Lesson content (Markdown) |
| code_template | TEXT | Starter code template |
| order_index | INTEGER | Display order within module |
| created_at | TIMESTAMP | Creation timestamp |

---

### exercises
Practice exercises with automatic validation.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| module_id | INTEGER | FK to modules |
| lesson_id | INTEGER | FK to lessons |
| title | VARCHAR(255) | Exercise title |
| description | TEXT | Exercise description |
| difficulty | VARCHAR(20) | 'beginner', 'intermediate', 'advanced' |
| starter_code | TEXT | Initial code provided |
| test_cases | JSONB | Test cases for validation |
| hints | JSONB | Progressive hints |
| points | INTEGER | Points awarded (default: 10) |
| created_at | TIMESTAMP | Creation timestamp |

**Constraints:**
- CHECK(difficulty IN ('beginner', 'intermediate', 'advanced'))

**Test Cases Format (JSONB):**
```json
[
  {
    "input": "test_input",
    "expected_output": "expected_result",
    "description": "Test case description"
  }
]
```

---

### exercise_submissions
Student exercise submissions with execution tracking.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| exercise_id | INTEGER | FK to exercises |
| user_id | INTEGER | FK to users |
| code | TEXT | Submitted code |
| status | VARCHAR(20) | 'correct', 'incorrect', 'pending' |
| output | TEXT | Execution output |
| submitted_at | TIMESTAMP | Submission timestamp |
| execution_time_ms | INTEGER | Execution time in milliseconds |

**Constraints:**
- CHECK(status IN ('correct', 'incorrect', 'pending'))

**Indexes:**
- idx_exercise_submissions_user
- idx_exercise_submissions_exercise
- idx_exercise_submissions_status

---

### project_submissions
Team project submissions (Trabajo_1, Trabajo_2, Concurso, Examen).

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| team_id | INTEGER | FK to teams |
| semester_id | INTEGER | FK to semesters |
| submission_type | VARCHAR(50) | Type of submission |
| notebook_url | TEXT | Cloudinary URL to notebook |
| status | VARCHAR(20) | 'pending', 'confirmed', 'graded' |
| grade | DECIMAL(5,2) | Grade (0-100) |
| feedback | TEXT | Professor feedback |
| submitted_at | TIMESTAMP | Submission timestamp |
| due_date | TIMESTAMP | Due date |
| is_late | BOOLEAN | Late submission flag |

**Constraints:**
- CHECK(submission_type IN ('trabajo_1', 'trabajo_2', 'concurso', 'examen'))
- CHECK(status IN ('pending', 'confirmed', 'graded'))

**Indexes:**
- idx_project_submissions_team
- idx_project_submissions_semester
- idx_project_submissions_type
- idx_project_submissions_status

---

### submission_confirmations
Team member confirmations for project submissions.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| submission_id | INTEGER | FK to project_submissions (CASCADE DELETE) |
| user_id | INTEGER | FK to users |
| confirmed_at | TIMESTAMP | Confirmation timestamp |

**Constraints:**
- UNIQUE(submission_id, user_id)

**Business Rule:** A submission is only valid when all team members have confirmed.

---

### grades
Student grades with automatic final grade calculation.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | FK to users |
| semester_id | INTEGER | FK to semesters |
| trabajo_1 | DECIMAL(5,2) | Trabajo 1 grade (20%) |
| trabajo_2 | DECIMAL(5,2) | Trabajo 2 grade (20%) |
| concurso | DECIMAL(5,2) | Concurso grade (20%) |
| examen | DECIMAL(5,2) | Examen grade (20%) |
| seguimiento | DECIMAL(5,2) | Seguimiento grade (20%) |
| final_grade | DECIMAL(5,2) | **COMPUTED**: Weighted average |
| updated_at | TIMESTAMP | Last update timestamp |

**Constraints:**
- UNIQUE(user_id, semester_id)

**Computed Columns:**
```sql
final_grade = (trabajo_1 * 0.20) + (trabajo_2 * 0.20) + 
              (concurso * 0.20) + (examen * 0.20) + 
              (seguimiento * 0.20)
```

**Indexes:**
- idx_grades_user_semester
- idx_grades_semester

---

### student_progress
Student progress tracking with automatic completion percentage.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | FK to users |
| module_id | INTEGER | FK to modules |
| exercises_completed | INTEGER | Number of completed exercises |
| exercises_total | INTEGER | Total exercises in module |
| completion_percentage | DECIMAL(5,2) | **COMPUTED**: Completion % |
| last_activity | TIMESTAMP | Last activity timestamp |

**Constraints:**
- UNIQUE(user_id, module_id)

**Computed Columns:**
```sql
completion_percentage = CASE 
  WHEN exercises_total > 0 
  THEN (exercises_completed / exercises_total * 100)
  ELSE 0 
END
```

**Indexes:**
- idx_student_progress_user
- idx_student_progress_module

---

### code_activity
Code execution activity for seguimiento calculation.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | FK to users |
| code_snippet | TEXT | Executed code snippet |
| execution_count | INTEGER | Number of executions |
| last_executed | TIMESTAMP | Last execution timestamp |

**Indexes:**
- idx_code_activity_user
- idx_code_activity_last_executed

---

### badges
Achievement badges with criteria.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Badge name |
| description | TEXT | Badge description |
| icon_url | TEXT | Badge icon URL |
| criteria | JSONB | Criteria for earning badge |
| points | INTEGER | XP points awarded |

**Criteria Format (JSONB):**
```json
{
  "type": "exercises_completed",
  "count": 10
}
```

---

### user_badges
User earned badges.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | FK to users |
| badge_id | INTEGER | FK to badges |
| earned_at | TIMESTAMP | Earned timestamp |

**Constraints:**
- UNIQUE(user_id, badge_id)

**Indexes:**
- idx_user_badges_user
- idx_user_badges_badge

---

### experience_points
Experience points tracking from various sources.

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| user_id | INTEGER | FK to users |
| points | INTEGER | Points earned |
| source | VARCHAR(50) | Source of points |
| description | TEXT | Description |
| earned_at | TIMESTAMP | Earned timestamp |

**Sources:**
- 'exercise_completed'
- 'submission_on_time'
- 'badge_earned'
- 'daily_streak'

**Indexes:**
- idx_experience_points_user

---

## Common Queries

### Get student's total progress
```sql
SELECT 
  u.full_name,
  AVG(sp.completion_percentage) as overall_progress,
  SUM(ep.points) as total_xp
FROM users u
LEFT JOIN student_progress sp ON u.id = sp.user_id
LEFT JOIN experience_points ep ON u.id = ep.user_id
WHERE u.id = ?
GROUP BY u.id, u.full_name;
```

### Get team submission status
```sql
SELECT 
  ps.*,
  COUNT(sc.id) as confirmations,
  COUNT(tm.id) as team_size,
  CASE 
    WHEN COUNT(sc.id) = COUNT(tm.id) THEN true 
    ELSE false 
  END as is_fully_confirmed
FROM project_submissions ps
JOIN teams t ON ps.team_id = t.id
LEFT JOIN team_members tm ON t.id = tm.team_id
LEFT JOIN submission_confirmations sc ON ps.id = sc.submission_id
WHERE ps.id = ?
GROUP BY ps.id;
```

### Calculate seguimiento grade
```sql
-- Based on: 40% exercises, 30% activity, 20% participation, 10% module progress
SELECT 
  user_id,
  (
    (exercise_score * 0.40) +
    (activity_score * 0.30) +
    (participation_score * 0.20) +
    (progress_score * 0.10)
  ) as seguimiento_grade
FROM (
  -- Subquery to calculate component scores
  SELECT user_id, ... FROM ...
) scores;
```

## Maintenance Queries

### Check database size
```sql
SELECT 
  pg_size_pretty(pg_database_size(current_database())) as database_size;
```

### Check table sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check index usage
```sql
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```
