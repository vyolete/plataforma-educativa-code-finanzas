# Plataforma Educativa - Backend

FastAPI backend para la Plataforma Educativa de Python para Análisis Financiero.

## Setup

1. Crear entorno virtual:
```bash
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
```

2. Instalar dependencias:
```bash
pip install -r requirements.txt
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. Ejecutar servidor de desarrollo:
```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en http://localhost:8000

## Documentación API

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Estructura

```
app/
├── main.py              # Punto de entrada de la aplicación
├── config.py            # Configuración
├── database.py          # Conexión a base de datos
├── models/              # Modelos SQLAlchemy
├── schemas/             # Schemas Pydantic
├── api/                 # Endpoints de la API
├── services/            # Lógica de negocio
└── utils/               # Utilidades
```

## Tests

```bash
pytest
```
