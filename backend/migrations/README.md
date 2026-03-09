# Database Migrations

This directory contains SQL migration scripts for the Plataforma Educativa database.

## Migration Files

### 001_initial_schema.sql
Initial database schema with core tables:
- Users, semesters, invitations
- Teams and team members
- Modules and lessons (basic structure)
- Exercises and submissions
- Grades and progress tracking
- Badges and gamification

**Status**: ✅ Executed

### 002_lessons_content.sql
Lesson content migration for Phase 6 of the Vercel Build Compilation Errors bugfix.

**Purpose**: Move educational content from TypeScript code (`lessons.ts`) to database

**Tables Created**:
- `lesson_content`: Rich content blocks (theory, examples, code, tips)
- `lesson_objectives`: Learning objectives for each lesson
- `lesson_prerequisites`: Lesson dependencies

**Status**: ✅ Executed on 2024-03-08

**Verification**: Run `python scripts/verify_migration_002.py` to check tables

## Running Migrations

### Manual Execution (Supabase SQL Editor)
1. Open Supabase Dashboard → SQL Editor
2. Copy migration file contents
3. Execute the SQL
4. Verify with verification queries

### Automated Execution (Python Script)
```bash
cd backend
source venv/bin/activate
python scripts/run_migration_002.py
```

## Verification

After running a migration, verify it was successful:

```bash
python scripts/verify_migration_002.py
```

This will show:
- All columns in each table
- Foreign key constraints
- Indexes created
- Table structure

## Next Steps After Migration 002

1. **Populate Data**: Create migration script to move data from `lessons.ts` to database
2. **Backend API**: Update lesson endpoints to fetch from database
3. **Frontend**: Update components to use API instead of static imports
4. **Testing**: Verify lesson data integrity and API performance
5. **Cleanup**: Remove or minimize `lessons.ts` file

## Rollback Strategy

If a migration needs to be rolled back:

```sql
-- For migration 002
DROP TABLE IF EXISTS lesson_prerequisites CASCADE;
DROP TABLE IF EXISTS lesson_objectives CASCADE;
DROP TABLE IF EXISTS lesson_content CASCADE;
```

**Note**: Always backup data before rolling back!

## Migration Best Practices

1. **Test First**: Run migrations on a test database before production
2. **Backup**: Always backup database before running migrations
3. **Verify**: Use verification scripts to confirm success
4. **Document**: Update this README with migration status
5. **Version Control**: Never modify executed migration files, create new ones instead
