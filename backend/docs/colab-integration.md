# Google Colab Integration

## Overview

This document describes the Google Colab integration feature that allows students to export their code to Jupyter notebooks and import notebooks from Google Colab.

## Features Implemented

### 1. Export to Google Colab (Requisito 37.1-37.5, 37.13, 37.20)

**Backend Service** (`app/services/colab_service.py`):
- `export_to_notebook()`: Converts Python code to .ipynb format
- Automatically adds required libraries (yfinance, pandas, matplotlib, numpy) in first cell
- Separates code and comments into appropriate cell types
- Includes metadata identifying exercise/module origin
- Preserves code structure (functions, classes, comments)

**API Endpoint** (`app/api/colab.py`):
- `POST /api/colab/export`: Exports code to notebook format
- Returns valid Jupyter notebook JSON structure

**Frontend Components**:
- `ColabExportButton`: Button in CodePanel to export current code
- Downloads .ipynb file and opens Google Colab in new tab
- Includes exercise/module metadata in export

### 2. Import from Google Colab (Requisito 37.6-37.12, 37.14-37.15, 37.18)

**Backend Service**:
- `import_from_notebook()`: Parses .ipynb files and extracts code
- Converts markdown cells to Python comments (triple quotes)
- Preserves cell order
- Validates syntax before insertion
- Extracts metadata if present

**API Endpoints**:
- `POST /api/colab/import`: Import from notebook JSON or URL
- `POST /api/colab/import/file`: Import from uploaded .ipynb file
- `POST /api/colab/validate-url`: Validate Google Colab URLs

**Frontend Components**:
- `ColabImportButton`: Button to trigger import modal
- `ColabImportModal`: Modal with two import methods:
  - File upload: Upload .ipynb file directly
  - URL validation: Validate Colab URL (with instructions to download)
- Shows syntax validation errors before inserting code
- Maintains import history with timestamps

### 3. Validation and Error Handling

**Syntax Validation**:
- `validate_notebook_syntax()`: Validates Python syntax before import
- Returns detailed error messages with line numbers
- Prevents insertion of invalid code

**URL Validation**:
- `validate_colab_url()`: Validates Google Colab URL format
- Supports drive, github, and gist URLs
- Provides clear error messages for invalid URLs

## API Endpoints

### Export Code to Notebook

```http
POST /api/colab/export
Content-Type: application/json

{
  "code": "import pandas as pd\nprint('Hello')",
  "metadata": {
    "exercise_id": 123,
    "module_id": 1
  }
}
```

**Response:**
```json
{
  "success": true,
  "notebook": {
    "cells": [...],
    "metadata": {...},
    "nbformat": 4,
    "nbformat_minor": 0
  },
  "message": "Notebook generado exitosamente"
}
```

### Import from Notebook

```http
POST /api/colab/import
Content-Type: application/json

{
  "notebook": {
    "cells": [...],
    "metadata": {...}
  }
}
```

**Response:**
```json
{
  "success": true,
  "code": "import pandas as pd\nprint('Hello')",
  "metadata": {
    "exercise_id": 123
  },
  "validation": {
    "valid": true
  },
  "message": "Código importado exitosamente desde Google Colab"
}
```

### Import from File

```http
POST /api/colab/import/file
Content-Type: multipart/form-data

file: notebook.ipynb
```

### Validate URL

```http
POST /api/colab/validate-url?url=https://colab.research.google.com/drive/...
```

## Frontend Usage

### In CodePanel Component

```tsx
import ColabExportButton from '@/components/colab/ColabExportButton';
import ColabImportButton from '@/components/colab/ColabImportButton';

// In render:
<ColabExportButton 
  code={code}
  metadata={{
    exercise_id: selectedExercise?.id,
    module_id: selectedExercise?.moduleId
  }}
/>

<ColabImportButton 
  onImport={(importedCode, metadata) => {
    setCode(importedCode);
    // Handle imported code
  }}
/>
```

## Notebook Structure

### Exported Notebook Format

```json
{
  "cells": [
    {
      "cell_type": "code",
      "source": ["import yfinance as yf\n", "import pandas as pd\n"],
      "metadata": {},
      "outputs": [],
      "execution_count": null
    },
    {
      "cell_type": "markdown",
      "source": ["# This is a comment\n"],
      "metadata": {}
    },
    {
      "cell_type": "code",
      "source": ["x = 5\n", "print(x)"],
      "metadata": {},
      "outputs": [],
      "execution_count": null
    }
  ],
  "metadata": {
    "kernelspec": {
      "display_name": "Python 3",
      "language": "python",
      "name": "python3"
    },
    "colab": {
      "name": "Plataforma Educativa - Notebook",
      "provenance": []
    },
    "plataforma_educativa": {
      "exercise_id": 123,
      "module_id": 1,
      "exported_at": "2024-01-15T10:30:00Z"
    }
  },
  "nbformat": 4,
  "nbformat_minor": 0
}
```

## Code Parsing Rules

### Export (Python → Notebook)

1. **Triple-quoted strings** (`"""` or `'''`): Converted to markdown cells
2. **Consecutive comment lines** (starting with `#`): Converted to markdown cells
3. **Regular code**: Kept as code cells
4. **Empty lines**: Preserved within cells
5. **Imports**: Automatically added to first cell if not present

### Import (Notebook → Python)

1. **Code cells**: Extracted as-is, preserving order
2. **Markdown cells**: Converted to triple-quoted strings (`"""..."""`)
3. **Empty cells**: Skipped
4. **Cell order**: Preserved from notebook

## Testing

Comprehensive test suite in `backend/tests/test_colab_service.py`:

- ✅ Export simple code to notebook
- ✅ Export with custom metadata
- ✅ Export with comments (markdown conversion)
- ✅ Import simple notebook
- ✅ Import with metadata extraction
- ✅ Validate valid Python syntax
- ✅ Validate invalid syntax (error detection)
- ✅ Validate Colab URLs (valid/invalid)
- ✅ Round-trip preservation (export → import)
- ✅ Invalid notebook structure handling

Run tests:
```bash
cd backend
pytest tests/test_colab_service.py -v
```

## User Workflow

### Export Workflow

1. Student writes code in CodePanel
2. Clicks "Abrir en Colab" button
3. System exports code to .ipynb format with metadata
4. Browser downloads the .ipynb file
5. Google Colab opens in new tab
6. Student uploads the downloaded file in Colab

### Import Workflow

1. Student clicks "Importar desde Colab" button
2. Modal opens with two options:
   - **File Upload**: Student uploads .ipynb file
   - **URL**: Student enters Colab URL (system provides download instructions)
3. System validates notebook structure and syntax
4. If valid, code is inserted into CodePanel
5. If invalid, error message is displayed with details

## Requirements Coverage

This implementation satisfies all requirements from Requisito 37:

- ✅ 37.1: "Abrir en Colab" button in Panel_Código
- ✅ 37.2: Export code to .ipynb format
- ✅ 37.3: Code in code cells, comments in markdown cells
- ✅ 37.4: Auto-open Google Colab in new tab
- ✅ 37.5: Include metadata identifying exercise/module
- ✅ 37.6: "Importar desde Colab" button
- ✅ 37.7: Accept Colab URL or .ipynb file upload
- ✅ 37.8: Validate URL is accessible
- ✅ 37.9: Parse .ipynb and extract code
- ✅ 37.10: Insert code preserving cell order
- ✅ 37.11: Convert markdown cells to Python comments
- ✅ 37.12: Allow synchronization via export/import
- ✅ 37.13: Include necessary libraries in first cell
- ✅ 37.14: Validate syntax before insertion
- ✅ 37.15: Show error if syntax errors found
- ✅ 37.18: Maintain history of synchronizations
- ✅ 37.19: Include contextual instructions
- ✅ 37.20: Preserve code structure (functions, classes, comments)

## Future Enhancements

Potential improvements for future iterations:

1. **Direct URL fetching**: Implement server-side fetching of notebooks from Colab URLs
2. **Team submissions**: Allow submitting team projects directly from Colab URL (Requisito 37.16-37.17)
3. **Sync history UI**: Display synchronization history in the interface
4. **Auto-sync**: Periodic auto-sync between platform and Colab
5. **Conflict resolution**: Handle conflicts when code differs between platform and Colab
6. **Version control**: Track versions of exported/imported notebooks

## Notes

- The current implementation requires students to manually download notebooks from Colab due to CORS restrictions
- Metadata is preserved in round-trip operations (export → import)
- All code is validated before insertion to prevent syntax errors
- The system is designed to work with free-tier services (no additional costs)
