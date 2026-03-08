"""
API endpoints for Google Colab integration.
"""
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import json

from app.services.colab_service import ColabService

router = APIRouter()


class ExportRequest(BaseModel):
    """Request model for exporting code to notebook."""
    code: str = Field(..., description="Python code to export")
    metadata: Optional[Dict[str, Any]] = Field(
        None,
        description="Optional metadata (exercise_id, module_id, etc.)"
    )


class ExportResponse(BaseModel):
    """Response model for export endpoint."""
    success: bool
    notebook: Dict[str, Any]
    message: str


class ImportRequest(BaseModel):
    """Request model for importing from Colab URL or notebook data."""
    url: Optional[str] = Field(None, description="Google Colab URL")
    notebook: Optional[Dict[str, Any]] = Field(None, description="Notebook JSON data")


class ImportResponse(BaseModel):
    """Response model for import endpoint."""
    success: bool
    code: str
    metadata: Dict[str, Any]
    validation: Dict[str, Any]
    message: str


@router.post("/export", response_model=ExportResponse)
async def export_to_colab(request: ExportRequest):
    """
    Export Python code to Jupyter notebook format (.ipynb).
    
    This endpoint converts Python code from the code editor into a valid
    Jupyter notebook format that can be opened in Google Colab.
    
    - **code**: Python code to export
    - **metadata**: Optional metadata to include in the notebook
    
    Returns the notebook as a JSON structure that can be saved as .ipynb
    """
    try:
        colab_service = ColabService()
        notebook = colab_service.export_to_notebook(
            code=request.code,
            metadata=request.metadata
        )
        
        return ExportResponse(
            success=True,
            notebook=notebook,
            message="Notebook generado exitosamente"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al exportar notebook: {str(e)}"
        )


@router.post("/import", response_model=ImportResponse)
async def import_from_colab(request: ImportRequest):
    """
    Import code from a Google Colab notebook.
    
    This endpoint accepts either:
    - A Google Colab URL (will be validated but not fetched - client handles download)
    - A notebook JSON structure directly
    
    The notebook is parsed and code is extracted from code cells.
    Markdown cells are converted to Python comments.
    
    - **url**: Google Colab URL (optional)
    - **notebook**: Notebook JSON data (optional)
    
    Returns the extracted Python code and validation results
    """
    try:
        colab_service = ColabService()
        
        # Validate that at least one input is provided
        if not request.url and not request.notebook:
            raise HTTPException(
                status_code=400,
                detail="Debe proporcionar una URL de Colab o datos de notebook"
            )
        
        # If URL is provided, validate it
        if request.url:
            if not colab_service.validate_colab_url(request.url):
                raise HTTPException(
                    status_code=400,
                    detail="URL de Google Colab inválida. Debe ser una URL de colab.research.google.com"
                )
            
            # Note: In a real implementation, you might want to fetch the notebook
            # from the URL here. For now, we expect the client to handle this.
            if not request.notebook:
                return ImportResponse(
                    success=False,
                    code="",
                    metadata={},
                    validation={"valid": False},
                    message="URL válida. Por favor, descargue el notebook y envíelo en el campo 'notebook'"
                )
        
        # Import from notebook data
        if not request.notebook:
            raise HTTPException(
                status_code=400,
                detail="Datos de notebook requeridos"
            )
        
        result = colab_service.import_from_notebook(request.notebook)
        code = result['code']
        metadata = result['metadata']
        
        # Validate syntax
        validation = colab_service.validate_notebook_syntax(code)
        
        if not validation['valid']:
            return ImportResponse(
                success=False,
                code=code,
                metadata=metadata,
                validation=validation,
                message=f"El código importado contiene errores de sintaxis: {validation.get('error', 'Error desconocido')}"
            )
        
        return ImportResponse(
            success=True,
            code=code,
            metadata=metadata,
            validation=validation,
            message="Código importado exitosamente desde Google Colab"
        )
    
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al importar notebook: {str(e)}"
        )


@router.post("/import/file")
async def import_from_file(file: UploadFile = File(...)):
    """
    Import code from an uploaded .ipynb file.
    
    This endpoint accepts a file upload of a Jupyter notebook (.ipynb)
    and extracts the Python code from it.
    
    - **file**: .ipynb file to import
    
    Returns the extracted Python code and validation results
    """
    try:
        # Validate file extension
        if not file.filename.endswith('.ipynb'):
            raise HTTPException(
                status_code=400,
                detail="El archivo debe tener extensión .ipynb"
            )
        
        # Read and parse file
        content = await file.read()
        try:
            notebook_data = json.loads(content)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400,
                detail="El archivo no es un JSON válido"
            )
        
        # Import using the service
        colab_service = ColabService()
        result = colab_service.import_from_notebook(notebook_data)
        code = result['code']
        metadata = result['metadata']
        
        # Validate syntax
        validation = colab_service.validate_notebook_syntax(code)
        
        if not validation['valid']:
            return ImportResponse(
                success=False,
                code=code,
                metadata=metadata,
                validation=validation,
                message=f"El código importado contiene errores de sintaxis: {validation.get('error', 'Error desconocido')}"
            )
        
        return ImportResponse(
            success=True,
            code=code,
            metadata=metadata,
            validation=validation,
            message="Código importado exitosamente desde archivo"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar archivo: {str(e)}"
        )


@router.post("/validate-url")
async def validate_colab_url(url: str):
    """
    Validate a Google Colab URL.
    
    - **url**: URL to validate
    
    Returns validation result
    """
    colab_service = ColabService()
    is_valid = colab_service.validate_colab_url(url)
    
    return {
        "valid": is_valid,
        "message": "URL válida de Google Colab" if is_valid else "URL inválida. Debe ser una URL de colab.research.google.com"
    }
