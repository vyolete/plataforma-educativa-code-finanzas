from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title="Plataforma Educativa Python Finanzas API",
    version="1.0.0",
    description="API REST para gestión de cursos, estudiantes y ejercicios"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Plataforma Educativa API"}

@app.get("/health")
def health():
    return {"status": "healthy"}
