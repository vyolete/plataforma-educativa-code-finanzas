# Lessons API Documentation

## Overview

The Lessons API provides endpoints for accessing lesson content, objectives, and prerequisites from the database. This API is part of Phase 6 of the Vercel Build Compilation Errors bugfix, which migrates lesson content from TypeScript code to the Supabase database.

## Base URL

```
http://localhost:8000/api
```

## Endpoints

### 1. Get All Lessons

Retrieve all lessons with basic information, ordered by module and order index.

**Endpoint:** `GET /lessons`

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "module_id": 1,
    "title": "Introducción a Python",
    "content": "Python es un lenguaje...",
    "code_template": "print('Hello, World!')",
    "order_index": 1,
    "created_at": "2024-01-01T00:00:00"
  }
]
```

**Example:**
```bash
curl http://localhost:8000/api/lessons
```

---

### 2. Get Lessons by Module

Retrieve all lessons for a specific module.

**Endpoint:** `GET /lessons/module/{module_id}`

**Parameters:**
- `module_id` (path, integer, required): ID of the module

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "module_id": 1,
    "title": "Introducción a Python",
    "content": "Python es un lenguaje...",
    "code_template": "print('Hello, World!')",
    "order_index": 1,
    "created_at": "2024-01-01T00:00:00"
  }
]
```

**Error Response:** `404 Not Found`

```json
{
  "detail": "No lessons found for module 999"
}
```

**Example:**
```bash
curl http://localhost:8000/api/lessons/module/1
```

---

### 3. Get Lesson Detail

Retrieve full lesson details including content blocks, objectives, and prerequisites.

**Endpoint:** `GET /lessons/{lesson_id}`

**Parameters:**
- `lesson_id` (path, integer, required): ID of the lesson

**Response:** `200 OK`

```json
{
  "id": 1,
  "module_id": 1,
  "title": "Introducción a Python",
  "content": "Python es un lenguaje...",
  "code_template": "print('Hello, World!')",
  "order_index": 1,
  "created_at": "2024-01-01T00:00:00",
  "content_blocks": [
    {
      "id": 1,
      "lesson_id": 1,
      "content_type": "theory",
      "content_order": 1,
      "title": "¿Qué es Python?",
      "markdown_content": "# Python\nPython es...",
      "code_example": null,
      "code_language": "python",
      "created_at": "2024-01-01T00:00:00",
      "updated_at": "2024-01-01T00:00:00"
    }
  ],
  "objectives": [
    {
      "id": 1,
      "lesson_id": 1,
      "objective_text": "Comprender qué es Python",
      "objective_order": 1,
      "created_at": "2024-01-01T00:00:00"
    }
  ]
}
```

**Error Response:** `404 Not Found`

```json
{
  "detail": "Lesson 999 not found"
}
```

**Example:**
```bash
curl http://localhost:8000/api/lessons/1
```

---

### 4. Create Lesson

Create a new lesson (admin only).

**Endpoint:** `POST /lessons`

**Request Body:**

```json
{
  "module_id": 1,
  "title": "Nueva Lección",
  "content": "Contenido de la lección",
  "code_template": "# Código inicial",
  "order_index": 5
}
```

**Response:** `201 Created`

```json
{
  "id": 12,
  "module_id": 1,
  "title": "Nueva Lección",
  "content": "Contenido de la lección",
  "code_template": "# Código inicial",
  "order_index": 5,
  "created_at": "2024-01-15T10:30:00"
}
```

**Example:**
```bash
curl -X POST http://localhost:8000/api/lessons \
  -H "Content-Type: application/json" \
  -d '{
    "module_id": 1,
    "title": "Nueva Lección",
    "content": "Contenido de la lección",
    "order_index": 5
  }'
```

---

### 5. Update Lesson

Update an existing lesson (admin only).

**Endpoint:** `PUT /lessons/{lesson_id}`

**Parameters:**
- `lesson_id` (path, integer, required): ID of the lesson to update

**Request Body:**

```json
{
  "title": "Título Actualizado",
  "content": "Contenido actualizado"
}
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "module_id": 1,
  "title": "Título Actualizado",
  "content": "Contenido actualizado",
  "code_template": "print('Hello, World!')",
  "order_index": 1,
  "created_at": "2024-01-01T00:00:00"
}
```

**Example:**
```bash
curl -X PUT http://localhost:8000/api/lessons/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Título Actualizado"
  }'
```

---

### 6. Delete Lesson

Delete a lesson (admin only).

**Endpoint:** `DELETE /lessons/{lesson_id}`

**Parameters:**
- `lesson_id` (path, integer, required): ID of the lesson to delete

**Response:** `204 No Content`

**Example:**
```bash
curl -X DELETE http://localhost:8000/api/lessons/1
```

---

## Data Models

### LessonResponse

Basic lesson information for list views.

```typescript
interface LessonResponse {
  id: number;
  module_id: number;
  title: string;
  content: string;
  code_template: string | null;
  order_index: number;
  created_at: string; // ISO 8601 datetime
}
```

### LessonDetailResponse

Detailed lesson information including content blocks and objectives.

```typescript
interface LessonDetailResponse {
  id: number;
  module_id: number;
  title: string;
  content: string;
  code_template: string | null;
  order_index: number;
  created_at: string;
  content_blocks: LessonContentResponse[];
  objectives: LessonObjectiveResponse[];
}
```

### LessonContentResponse

Rich content block within a lesson.

```typescript
interface LessonContentResponse {
  id: number;
  lesson_id: number;
  content_type: 'theory' | 'example' | 'exercise' | 'tip' | 'warning' | 'code';
  content_order: number;
  title: string | null;
  markdown_content: string;
  code_example: string | null;
  code_language: string; // default: 'python'
  created_at: string;
  updated_at: string;
}
```

### LessonObjectiveResponse

Learning objective for a lesson.

```typescript
interface LessonObjectiveResponse {
  id: number;
  lesson_id: number;
  objective_text: string;
  objective_order: number;
  created_at: string;
}
```

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `204 No Content`: Resource deleted successfully
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

Error responses include a `detail` field with a descriptive message:

```json
{
  "detail": "Error message here"
}
```

---

## Testing

### Manual Testing

Run the manual test script to verify all endpoints:

```bash
cd backend
python3 tests/test_lessons_api_manual.py
```

### Unit Testing

Run the unit tests:

```bash
cd backend
python3 -m pytest tests/test_lessons_api.py -v
```

### Interactive API Documentation

FastAPI provides interactive API documentation at:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## Database Schema

The lessons API uses the following database tables:

### lessons

Main lesson table (existing from migration 001).

```sql
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES modules(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    code_template TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### lesson_content

Rich content blocks for lessons (new in migration 002).

```sql
CREATE TABLE lesson_content (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL,
    content_order INTEGER NOT NULL,
    title VARCHAR(200),
    markdown_content TEXT NOT NULL,
    code_example TEXT,
    code_language VARCHAR(20) DEFAULT 'python',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, content_order)
);
```

### lesson_objectives

Learning objectives for lessons (new in migration 002).

```sql
CREATE TABLE lesson_objectives (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    objective_text TEXT NOT NULL,
    objective_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, objective_order)
);
```

### lesson_prerequisites

Lesson dependencies (new in migration 002).

```sql
CREATE TABLE lesson_prerequisites (
    lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    prerequisite_lesson_id INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (lesson_id, prerequisite_lesson_id)
);
```

---

## Implementation Status

✅ **Completed:**
- SQLAlchemy models for Lesson, LessonContent, LessonObjective
- Pydantic schemas for request/response validation
- API endpoints for CRUD operations
- Database migration (002_lessons_content.sql)
- Data migration script (migrate_lessons_to_db.py)
- Unit tests and manual tests
- API documentation

📋 **Next Steps (Task 19.2):**
- Create frontend API client (`frontend/src/lib/api/lessons.ts`)
- Create TypeScript types (`frontend/src/types/lesson.ts`)
- Update frontend components to use API instead of static data

---

## Notes

- The `content` field in the `lessons` table is a legacy field from the original schema. New lessons should use the `lesson_content` table for rich content blocks.
- Content blocks and objectives are automatically sorted by their `content_order` and `objective_order` fields.
- All relationships use cascade delete, so deleting a lesson will automatically delete its content blocks and objectives.
- The API currently has no authentication/authorization. This should be added before production deployment.

---

## Support

For issues or questions, refer to:
- Bugfix spec: `.kiro/specs/vercel-build-compilation-errors/bugfix.md`
- Design document: `.kiro/specs/vercel-build-compilation-errors/design.md`
- Tasks: `.kiro/specs/vercel-build-compilation-errors/tasks.md`
