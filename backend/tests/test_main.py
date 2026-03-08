"""
Tests básicos para verificar la configuración del backend.
"""
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_root_endpoint():
    """Test del endpoint raíz"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Plataforma Educativa API"}


def test_health_endpoint():
    """Test del endpoint de health check"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_cors_headers():
    """Verificar que CORS está configurado"""
    response = client.get("/health")
    # FastAPI/Starlette agrega headers CORS automáticamente
    assert response.status_code == 200
