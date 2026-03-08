# Plataforma Educativa - Backend

FastAPI backend para la Plataforma Educativa de Python para Análisis Financiero.

## Requisitos

- Python 3.9 o superior
- PostgreSQL 12 o superior (o usar Supabase)

## Setup

1. Crear entorno virtual:
```bash
python3 -m venv venv
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
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

El servidor estará disponible en http://localhost:8000

## Documentación API

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Estructura

```
app/
├── main.py              # Punto de entrada de la aplicación
├── config.py            # Configuración y variables de entorno
├── database.py          # Conexión a base de datos SQLAlchemy
├── models/              # Modelos SQLAlchemy (ORM)
├── schemas/             # Schemas Pydantic (validación)
├── api/                 # Endpoints de la API REST
├── services/            # Lógica de negocio
└── utils/               # Utilidades (seguridad, validadores, parsers)
```

## Endpoints Disponibles

- `GET /` - Mensaje de bienvenida
- `GET /health` - Health check del servidor

## Tests

```bash
pytest
```

## Deployment

### Railway
1. Conectar repositorio en Railway
2. Configurar variables de entorno
3. Railway detectará automáticamente el Dockerfile

### Render
1. Crear nuevo Web Service
2. Conectar repositorio
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Configuración CORS

El backend está configurado para aceptar requests desde:
- `http://localhost:3000` (desarrollo local)
- `https://localhost:3000` (desarrollo local HTTPS)
- Dominios adicionales configurables via variable de entorno `CORS_ORIGINS`

Para producción, agregar el dominio de Vercel en `.env`:
```
CORS_ORIGINS=http://localhost:3000,https://localhost:3000,https://tu-app.vercel.app
```
