# Backend - Database Setup

This document provides a quick start guide for setting up the database for the Plataforma Educativa.

## Quick Start

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a free account
2. Create a new project (choose a strong password!)
3. Wait for provisioning (~2-3 minutes)

### 2. Run Migration Script

1. In Supabase dashboard, go to **SQL Editor**
2. Click **"New query"**
3. Copy contents of `backend/migrations/001_initial_schema.sql`
4. Paste and click **"Run"**
5. Verify success message

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your Supabase connection string
# Get it from: Supabase Dashboard → Settings → Database → Connection string
```

Your `.env` should look like:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```

### 4. Test Connection

```bash
# Install dependencies
pip install -r requirements.txt

# Test database connection
python scripts/test_db_connection.py
```

You should see:
```
✅ Database connection successful!
✅ All 17 required tables exist!
✅ Found 25+ indexes
✅ Computed columns working correctly!
🎉 All tests passed! Database is ready to use.
```

## Database Schema

The database includes 17 tables:

**Core Tables:**
- `users` - Students and professors
- `semesters` - Academic periods
- `invitations` - Registration tokens
- `teams` - Student teams (2-4 members)
- `team_members` - Team membership

**Content Tables:**
- `modules` - Course modules (8 total)
- `lessons` - Individual lessons
- `exercises` - Practice exercises

**Submission Tables:**
- `exercise_submissions` - Exercise solutions
- `project_submissions` - Team projects (Trabajo_1, Trabajo_2, etc.)
- `submission_confirmations` - Team confirmations

**Grading Tables:**
- `grades` - Student grades (automatic final grade calculation)
- `student_progress` - Progress tracking

**Gamification Tables:**
- `badges` - Achievement badges
- `user_badges` - Earned badges
- `experience_points` - XP tracking
- `code_activity` - Code execution tracking

## Key Features

### Automatic Calculations

The schema includes computed columns that update automatically:

1. **grades.final_grade** - Weighted average (20% each component)
2. **student_progress.completion_percentage** - Exercises completed / total
3. **semesters.duration_weeks** - Calculated from dates

### Optimized Indexes

25+ indexes for fast queries on:
- User lookups by email and semester
- Team queries
- Exercise submissions
- Progress tracking
- Grades

### Data Integrity

- Foreign key constraints
- Check constraints for enums
- Unique constraints
- Cascade deletes where appropriate

## Documentation

- **Full Setup Guide**: `docs/database-setup.md`
- **Schema Reference**: `docs/database-schema-reference.md`
- **Migration Script**: `migrations/001_initial_schema.sql`

## Troubleshooting

### Connection Failed

1. Check your DATABASE_URL in `.env`
2. Verify password is correct
3. Ensure Supabase project is active

### Missing Tables

Run the migration script in Supabase SQL Editor:
```sql
-- See: migrations/001_initial_schema.sql
```

### Test Script Fails

```bash
# Check Python dependencies
pip install -r requirements.txt

# Verify .env file exists
cat .env

# Check database connection manually
python -c "from app.database import check_db_connection; print(check_db_connection())"
```

## Next Steps

After database setup:

1. ✅ Database configured
2. ⬜ Implement SQLAlchemy models (Task 2.1)
3. ⬜ Create API endpoints (Task 2.2)
4. ⬜ Test authentication flow (Task 2.3)

## Free Tier Limits

Supabase free tier:
- **Database**: 500MB (sufficient for ~1000 students)
- **Bandwidth**: 2GB/month
- **API requests**: Unlimited

For 30-50 students per semester, free tier is more than sufficient.

## Support

- **Supabase Docs**: https://supabase.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Full Setup Guide**: `docs/database-setup.md`
