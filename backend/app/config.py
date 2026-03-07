from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # API
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "Plataforma Educativa Python Finanzas"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://localhost:3000",
    ]
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost:5432/plataforma_educativa"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Email
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@plataforma-educativa.com"
    
    # Cloudinary
    CLOUDINARY_URL: str = ""
    
    # GitHub OAuth
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
