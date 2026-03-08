"""
Configuración de pytest para los tests del backend.
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Fixture que proporciona un cliente de prueba para FastAPI"""
    return TestClient(app)
