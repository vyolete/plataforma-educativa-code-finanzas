# Database Setup Guide - Supabase PostgreSQL

This guide walks you through setting up the PostgreSQL database for the Plataforma Educativa using Supabase.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Basic understanding of SQL

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a free account
3. Click **"New Project"**
4. Fill in the project details:
   - **Name**: `plataforma-educativa-python` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Select the closest region to your users (e.g., South America)
   - **Pricing Plan**: Free tier (500MB database, sufficient for 30-50 students)
5. Click **"Create new project"**
6. Wait 2-3 minutes for the project to be provisioned

## Step 2: Run the Migration Script

1. In your Supabase project dashboard, navigate to the **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the migration file: `backend/migrations/001_initial_schema.sql`
4. Copy the entire contents of the file
5. Paste it into the Supabase SQL Editor
6. Click **"Run"** (or press Ctrl+Enter)
7. Wait for the script to complete (should take 5-10 seconds)
8. You should see a success message: "Success. No rows returned"

## Step 3: Verify the Schema

After running the migration, verify that all tables were created:

```sql
-- Run this query in the SQL Editor
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see these tables:
- badges
- code_activity
- exercise_submissions
- exercises
- experience_points
- grades
- invitations
- lessons
- modules
- project_submissions
- semesters
- student_progress
- submission_confirmations
- team_members
- teams
- user_badges
- users

## Step 4: Get Your Connection String

1. In your Supabase project dashboard, click **"Settings"** (gear icon in left sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"**
4. Select **"URI"** tab
5. Copy the connection string (it looks like this):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with the database password you created in Step 1

### Alternative: Connection Pooling (Recommended for Production)

For better performance with multiple connections:

1. In the same **"Connection string"** section, select the **"Connection pooling"** tab
2. Copy the connection string with `:6543` port (pooler port)
3. This uses PgBouncer for connection pooling

## Step 5: Configure Backend Environment

1. Navigate to the `backend` directory
2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Open `.env` in your text editor
4. Update the `DATABASE_URL` with your Supabase connection string:
   ```env
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
   ```
5. Save the file

### Additional Supabase Configuration (Optional)

If you want to use Supabase Auth instead of custom JWT:

1. In Supabase dashboard, go to **"Authentication"** → **"Settings"**
2. Copy your **"Project URL"** and **"anon public"** key
3. Add to your `.env`:
   ```env
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_KEY=your-anon-public-key
   ```

## Step 6: Test the Connection

Test that your backend can connect to the database:

```bash
cd backend
python -c "from app.database import engine; print('Connection successful!' if engine.connect() else 'Connection failed')"
```

You should see: `Connection successful!`

## Step 7: Optional - Add Initial Data

If you want to add initial badges or test data, you can run additional SQL:

```sql
-- Add default achievement badges
INSERT INTO badges (name, description, criteria, points) VALUES
('Primera Ejecución', 'Ejecutaste tu primer código Python', '{"type": "first_execution"}', 10),
('10 Ejercicios', 'Completaste 10 ejercicios', '{"type": "exercises_completed", "count": 10}', 50),
('Módulo Completo', 'Completaste un módulo completo', '{"type": "module_completed"}', 100),
('Entrega a Tiempo', 'Entregaste un proyecto antes de la fecha límite', '{"type": "on_time_submission"}', 75),
('Racha de 7 Días', 'Usaste la plataforma 7 días consecutivos', '{"type": "streak", "days": 7}', 150);
```

## Database Schema Overview

### Key Tables

- **users**: Students and professors with institutional email (@correo.itm.edu.co)
- **semesters**: Academic periods with automatic duration calculation
- **invitations**: Registration tokens with expiration
- **teams**: Student teams (2-4 members) for collaborative projects
- **exercises**: Practice exercises with automatic validation
- **project_submissions**: Team project submissions (Trabajo_1, Trabajo_2, Concurso, Examen)
- **grades**: Student grades with automatic final grade calculation (20% each component)
- **student_progress**: Progress tracking with automatic completion percentage

### Computed Columns

The schema includes several computed columns that are automatically calculated:

1. **semesters.duration_weeks**: Calculated from start_date and end_date
2. **grades.final_grade**: Weighted average of 5 components (20% each)
3. **student_progress.completion_percentage**: Calculated from exercises_completed/exercises_total

### Indexes

The schema includes optimized indexes for:
- User lookups by email and semester
- Team queries by semester
- Exercise submissions by user and exercise
- Progress tracking queries
- Grade lookups

## Monitoring and Maintenance

### View Database Usage

In Supabase dashboard:
1. Go to **"Settings"** → **"Database"**
2. Check **"Database size"** (free tier: 500MB limit)
3. Monitor **"Active connections"**

### Backup Strategy

Supabase automatically backs up your database daily. To create manual backups:

1. Go to **"Database"** → **"Backups"** in Supabase dashboard
2. Click **"Create backup"**
3. Backups are retained for 7 days on free tier

### Performance Monitoring

Monitor query performance:
1. Go to **"Database"** → **"Query Performance"**
2. Review slow queries
3. Add indexes if needed

## Troubleshooting

### Connection Refused

- Verify your IP is not blocked (Supabase allows all IPs by default)
- Check that you're using the correct connection string
- Ensure your database password is correct

### Migration Errors

If the migration fails:
1. Check the error message in SQL Editor
2. Verify you're running the script in a fresh database
3. If tables already exist, you may need to drop them first:
   ```sql
   DROP SCHEMA public CASCADE;
   CREATE SCHEMA public;
   ```
   Then re-run the migration.

### Slow Queries

If queries are slow:
1. Check that indexes were created (see verification queries in migration script)
2. Monitor query performance in Supabase dashboard
3. Consider upgrading to connection pooling

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** - Never hardcode credentials
3. **Rotate passwords regularly** - Update database password every 90 days
4. **Enable Row Level Security (RLS)** - For production, enable RLS policies in Supabase
5. **Use connection pooling** - For production deployments

## Next Steps

After setting up the database:

1. ✅ Database schema created
2. ✅ Connection string configured
3. ⬜ Implement SQLAlchemy models (Task 2.1)
4. ⬜ Create API endpoints (Task 2.2)
5. ⬜ Test authentication flow (Task 2.3)

## Support

- **Supabase Documentation**: https://supabase.com/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Project Issues**: Create an issue in the repository

## Free Tier Limits

Keep in mind Supabase free tier limits:
- **Database size**: 500MB (sufficient for ~1000 students)
- **Bandwidth**: 2GB/month
- **API requests**: Unlimited
- **Storage**: 1GB (use Cloudinary for notebooks/files)

For a course with 30-50 students per semester, the free tier is more than sufficient.
