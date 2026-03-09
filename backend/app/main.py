from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import auth, semesters, exercises, teams, colab, submissions, grades, progress, lessons

app = FastAPI(
    title="Plataforma Educativa Python Finanzas API",
    version="1.0.0",
    description="API REST para gestión de cursos, estudiantes y ejercicios"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(semesters.router, prefix="/api/semesters", tags=["Semesters"])
app.include_router(exercises.router, prefix="/api/exercises", tags=["Exercises"])
app.include_router(teams.router, prefix="/api/teams", tags=["Teams"])
app.include_router(colab.router, prefix="/api/colab", tags=["Google Colab"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["Submissions"])
app.include_router(grades.router, prefix="/api/grades", tags=["Grades"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])
app.include_router(lessons.router, prefix="/api", tags=["Lessons"])

@app.get("/")
def root():
    return {"message": "Plataforma Educativa API"}

@app.get("/health")
def health():
    return {"status": "healthy"}
