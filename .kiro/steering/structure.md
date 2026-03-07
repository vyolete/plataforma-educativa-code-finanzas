# Project Structure

## Repository Layout

```
/
├── .kiro/                    # Kiro configuration and specs
│   ├── specs/               # Feature specifications
│   └── steering/            # Project guidelines (this file)
├── backend/                 # FastAPI backend (empty - to be implemented)
├── docs/                    # Documentation (empty)
├── frontend/                # Next.js frontend
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Frontend Structure (Planned)

Based on the design document, the frontend will follow this structure:

```
frontend/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── (auth)/         # Authentication routes
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── invite/[token]/
│   │   ├── (student)/      # Student routes
│   │   │   ├── dashboard/
│   │   │   ├── laboratory/ # Main learning interface
│   │   │   ├── exercises/
│   │   │   ├── grades/
│   │   │   └── team/
│   │   ├── (professor)/    # Professor routes
│   │   │   ├── admin/
│   │   │   ├── students/
│   │   │   ├── teams/
│   │   │   ├── submissions/
│   │   │   └── semesters/
│   │   └── api/            # API routes (Next.js API)
│   │       └── proxy/
│   │           └── yfinance/
│   ├── components/         # React components
│   │   ├── laboratory/     # 4-panel lab interface
│   │   ├── editor/         # Monaco editor wrapper
│   │   ├── pyodide/        # Python execution
│   │   ├── visualization/  # Charts and plots
│   │   ├── gamification/   # Badges, progress, leaderboard
│   │   ├── comparison/     # Python/R side-by-side
│   │   └── shared/         # Reusable UI components
│   ├── lib/                # Utilities and services
│   │   ├── pyodide/        # Pyodide loader and executor
│   │   ├── api/            # API client functions
│   │   └── utils/          # Helper functions
│   └── workers/            # Web Workers
│       └── pyodide.worker.ts
├── public/                 # Static assets
├── package.json
└── tsconfig.json
```

## Backend Structure (Planned)

```
backend/
├── app/
│   ├── main.py             # FastAPI app entry point
│   ├── config.py           # Configuration
│   ├── database.py         # Database connection
│   ├── models/             # SQLAlchemy models
│   │   ├── user.py
│   │   ├── semester.py
│   │   ├── team.py
│   │   ├── exercise.py
│   │   ├── submission.py
│   │   └── grade.py
│   ├── schemas/            # Pydantic schemas
│   ├── api/                # API endpoints
│   │   ├── auth.py
│   │   ├── semesters.py
│   │   ├── teams.py
│   │   ├── exercises.py
│   │   ├── submissions.py
│   │   ├── grades.py
│   │   ├── progress.py
│   │   └── proxy.py        # yfinance proxy
│   ├── services/           # Business logic
│   │   ├── auth_service.py
│   │   ├── email_service.py
│   │   ├── github_service.py
│   │   └── grading_service.py
│   └── utils/              # Utilities
│       ├── security.py
│       ├── validators.py
│       └── parsers.py
├── tests/
├── requirements.txt
└── Dockerfile
```

## Key Architectural Patterns

### Frontend
- **App Router**: Next.js 14 App Router with route groups for role-based layouts
- **Component Organization**: Feature-based folders (laboratory, editor, etc.)
- **State Management**: React hooks + Context API (no Redux needed for this scale)
- **Web Workers**: Pyodide runs in separate worker to avoid blocking UI

### Backend
- **Layered Architecture**: API → Services → Models
- **Dependency Injection**: FastAPI's Depends() for database sessions
- **RESTful API**: Standard REST endpoints with OpenAPI docs
- **Proxy Pattern**: Backend proxies yfinance to avoid CORS issues

## Database Schema

Key tables (PostgreSQL):
- `users` - Students and professors
- `semesters` - Academic periods
- `invitations` - Registration invitations
- `teams` - Student teams (2-4 members)
- `team_members` - Team membership
- `modules` - Course modules (8 total)
- `lessons` - Individual lessons within modules
- `exercises` - Practice exercises
- `exercise_submissions` - Student solutions
- `submissions` - Project submissions (Trabajo_1, Trabajo_2, etc.)
- `grades` - Grading records
- `progress` - Student progress tracking

## Configuration Files

- `frontend/package.json` - Frontend dependencies
- `frontend/tsconfig.json` - TypeScript configuration
- `backend/requirements.txt` - Python dependencies
- `.kiro/specs/*/` - Feature specifications with requirements, design, and tasks

## Naming Conventions

- **Files**: kebab-case (e.g., `user-profile.tsx`)
- **Components**: PascalCase (e.g., `LaboratoryLayout`)
- **Functions/Variables**: camelCase (e.g., `executeCode`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_TEAM_SIZE`)
- **Database Tables**: snake_case (e.g., `team_members`)
- **API Routes**: kebab-case (e.g., `/api/exercise-submissions`)

## Environment Variables

Frontend (.env.local):
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GITHUB_CLIENT_ID=...
```

Backend (.env):
```
DATABASE_URL=postgresql://...
SUPABASE_URL=...
SUPABASE_KEY=...
CLOUDINARY_URL=...
JWT_SECRET=...
```
