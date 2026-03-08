# Project Submissions System - Implementation Guide

## Overview

The project submissions system allows teams to upload Jupyter notebooks (.ipynb files) for evaluation. All team members must confirm a submission before it becomes valid, and professors can grade confirmed submissions.

## Architecture

### Backend Components

1. **Models** (`app/models/submission.py`)
   - `ProjectSubmission`: Main submission record
   - `SubmissionConfirmation`: Tracks individual team member confirmations

2. **Schemas** (`app/schemas/submission.py`)
   - Request/response models for API endpoints
   - Validation for submission types and grades

3. **Services**
   - `SubmissionService` (`app/services/submission_service.py`): Business logic
   - `CloudinaryService` (`app/services/cloudinary_service.py`): File upload/validation

4. **API Endpoints** (`app/api/submissions.py`)
   - `POST /api/submissions/` - Create submission
   - `POST /api/submissions/{id}/confirm` - Confirm submission
   - `GET /api/submissions/team/{team_id}` - Get team submissions
   - `PUT /api/submissions/{id}/grade` - Grade submission (professor)
   - `GET /api/submissions/semester/{semester_id}` - Get all submissions (professor)

### Frontend Components

1. **API Client** (`frontend/src/lib/api/submissions.ts`)
   - TypeScript interfaces and API functions

2. **Components**
   - `SubmissionUploadForm`: Drag-and-drop file upload with validation
   - `SubmissionsList`: Display team submissions with confirmation status

3. **Pages**
   - `/app/(student)/submissions/page.tsx`: Student submission interface
   - `/app/(professor)/submissions/page.tsx`: Professor grading interface

## Workflow

### Student Submission Flow

1. **Upload**: Any team member uploads a .ipynb file
   - File is validated (format, size, content)
   - Uploaded to Cloudinary
   - Submission record created with status "pending"

2. **Confirmation**: Each team member confirms the submission
   - System tracks confirmations
   - When all members confirm, status changes to "confirmed"

3. **Grading**: Professor reviews and grades
   - Only confirmed submissions can be graded
   - Status changes to "graded"

### Validation Rules

**File Validation:**
- Must be .ipynb format
- Maximum size: 10MB
- Must contain valid JSON structure
- Must have at least one code cell

**Content Validation (warnings):**
- Should include financial analysis (yfinance, pandas)
- Should include visualizations (matplotlib)

**Submission Rules:**
- One submission per type per team
- All team members must confirm
- Late submissions are marked but accepted

## Configuration

### Environment Variables

Add to `backend/.env`:
```bash
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
```

Get your Cloudinary URL from: https://cloudinary.com/console

### Database

Tables are already defined in `backend/migrations/001_initial_schema.sql`:
- `project_submissions`
- `submission_confirmations`

## Submission Types

| Type | Label | Due Week | Weight |
|------|-------|----------|--------|
| `trabajo_1` | Trabajo 1 | Week 6 | 20% |
| `trabajo_2` | Trabajo 2 | Week 11 | 20% |
| `concurso` | Concurso | Week 15 | 20% |
| `examen` | Examen Final | Week 17 | 20% |

## API Examples

### Create Submission

```bash
curl -X POST http://localhost:8000/api/submissions/ \
  -H "Authorization: Bearer {token}" \
  -F "team_id=1" \
  -F "semester_id=1" \
  -F "submission_type=trabajo_1" \
  -F "due_date=2024-03-15T23:59:59" \
  -F "file=@notebook.ipynb"
```

### Confirm Submission

```bash
curl -X POST http://localhost:8000/api/submissions/1/confirm \
  -H "Authorization: Bearer {token}"
```

### Grade Submission

```bash
curl -X PUT http://localhost:8000/api/submissions/1/grade \
  -H "Authorization: Bearer {token}" \
  -F "grade=4.5" \
  -F "feedback=Excelente análisis financiero"
```

## Security

- Team membership is verified for all operations
- Only professors can grade submissions
- File uploads are validated and sanitized
- Cloudinary provides secure storage with CDN

## Error Handling

Common errors:
- `400`: Invalid file format or size
- `403`: Not a team member
- `404`: Submission not found
- `500`: Upload or server error

## Testing

To test the implementation:

1. **Backend**: Start the FastAPI server
   ```bash
   cd backend
   uvicorn app.main:app --reload
   ```

2. **Frontend**: Start the Next.js dev server
   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Flow**:
   - Create a team
   - Upload a test notebook
   - Confirm with all team members
   - Grade as professor

## Future Enhancements

- Automatic due date calculation from semester config
- Email notifications for confirmations
- Version history for submissions
- Plagiarism detection
- Automated grading for code quality
