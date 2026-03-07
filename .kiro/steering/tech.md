# Technology Stack

## Architecture

Full-stack web application with client-side Python execution to minimize infrastructure costs.

## Frontend

- **Framework**: Next.js 14.2.5 (React 18.3.1)
- **Styling**: TailwindCSS 3.4.4
- **Language**: TypeScript 5
- **Hosting**: Vercel (free tier)
- **Code Editor**: Monaco Editor
- **Python Runtime**: Pyodide (WebAssembly) - runs Python in browser
  - Includes: numpy, pandas, matplotlib, scipy
  - Loaded in Web Worker to avoid blocking UI
  - ~5-10 second initial load time

## Backend

- **Framework**: FastAPI (Python)
- **Hosting**: Railway or Render (free tier)
- **Purpose**: 
  - User authentication and authorization
  - Exercise/submission management
  - yfinance proxy (to avoid CORS)
  - Grading and progress tracking

## Database

- **Primary**: Supabase PostgreSQL (500MB free tier)
- **Alternative**: MongoDB Atlas (512MB free tier)
- **Features**: Row Level Security, Realtime subscriptions

## Storage

- **Service**: Cloudinary (25GB storage, 25GB bandwidth/month)
- **Purpose**: Notebooks, project submissions, visualizations

## Authentication

- **Service**: Supabase Auth or custom JWT
- **Method**: Email verification with 6-digit codes
- **OAuth**: GitHub integration for repository linking

## External Integrations

- **yfinance**: Real-time financial data (proxied through backend)
- **GitHub OAuth**: Repository linking for team projects
- **Google Colab API**: Notebook export/import
- **Email**: SendGrid or Resend for invitations and notifications

## Development Commands

```bash
# Frontend
cd frontend
npm install          # Install dependencies
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # Run ESLint

# Backend
cd backend
pip install -r requirements.txt  # Install dependencies
uvicorn app.main:app --reload    # Start dev server (localhost:8000)
pytest                           # Run tests
```

## Key Libraries

### Frontend
- `@monaco-editor/react` - Code editor
- `pyodide` - Python runtime in browser
- `recharts` or `plotly.js` - Interactive charts
- `framer-motion` - Animations

### Backend
- `fastapi` - Web framework
- `sqlalchemy` - ORM
- `yfinance` - Financial data
- `pydantic` - Data validation
- `python-jose` - JWT tokens
- `passlib` - Password hashing

## Browser Requirements

- Modern browsers with WebAssembly support
- Minimum resolution: 1280x720
- Recommended: Chrome, Firefox, Edge (latest versions)

## Performance Targets

- Pyodide load time: <10 seconds
- Code execution: <5 seconds for typical exercises
- Code execution timeout: 30 seconds max
- API response time: <500ms
