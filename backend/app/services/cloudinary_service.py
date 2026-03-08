import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from fastapi import UploadFile, HTTPException
from app.config import settings
import json
from typing import Dict, Optional
import os


class CloudinaryService:
    def __init__(self):
        """Initialize Cloudinary with configuration from environment"""
        if settings.CLOUDINARY_URL:
            # Parse CLOUDINARY_URL format: cloudinary://api_key:api_secret@cloud_name
            cloudinary.config(cloudinary_url=settings.CLOUDINARY_URL)
        else:
            raise ValueError("CLOUDINARY_URL not configured")
    
    async def upload_notebook(
        self,
        file: UploadFile,
        team_id: int,
        submission_type: str
    ) -> Dict[str, str]:
        """
        Upload a notebook file to Cloudinary.
        
        Args:
            file: The uploaded file
            team_id: Team ID for organizing files
            submission_type: Type of submission (trabajo_1, trabajo_2, etc.)
        
        Returns:
            Dict with url and public_id
        
        Raises:
            HTTPException: If validation fails or upload fails
        """
        # Validate file extension
        if not file.filename.endswith('.ipynb'):
            raise HTTPException(
                status_code=400,
                detail="Only .ipynb files are allowed"
            )
        
        # Read file content
        content = await file.read()
        
        # Validate file size (10MB max)
        max_size = 10 * 1024 * 1024  # 10MB in bytes
        if len(content) > max_size:
            raise HTTPException(
                status_code=400,
                detail=f"File size exceeds maximum of 10MB. Current size: {len(content) / (1024 * 1024):.2f}MB"
            )
        
        # Validate JSON structure
        try:
            notebook_data = json.loads(content)
            
            # Basic validation of notebook structure
            if not isinstance(notebook_data, dict):
                raise ValueError("Notebook must be a JSON object")
            
            if 'cells' not in notebook_data:
                raise ValueError("Notebook must contain 'cells' field")
            
            if not isinstance(notebook_data['cells'], list):
                raise ValueError("Notebook 'cells' must be a list")
            
        except json.JSONDecodeError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid JSON format: {str(e)}"
            )
        except ValueError as e:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid notebook structure: {str(e)}"
            )
        
        # Reset file pointer
        await file.seek(0)
        
        # Create folder structure: submissions/team_{team_id}/{submission_type}
        folder = f"submissions/team_{team_id}/{submission_type}"
        
        # Generate public_id with timestamp to avoid conflicts
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        public_id = f"{folder}/{timestamp}_{file.filename.replace('.ipynb', '')}"
        
        try:
            # Upload to Cloudinary
            result = cloudinary.uploader.upload(
                file.file,
                resource_type="raw",  # For non-image files
                public_id=public_id,
                folder=folder,
                overwrite=False,
                use_filename=True,
                unique_filename=True
            )
            
            return {
                "url": result["secure_url"],
                "public_id": result["public_id"],
                "bytes": result["bytes"],
                "format": result["format"]
            }
        
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload file to Cloudinary: {str(e)}"
            )
    
    def delete_notebook(self, public_id: str) -> bool:
        """
        Delete a notebook from Cloudinary.
        
        Args:
            public_id: The public_id of the file to delete
        
        Returns:
            True if successful
        """
        try:
            result = cloudinary.uploader.destroy(
                public_id,
                resource_type="raw"
            )
            return result.get("result") == "ok"
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"Failed to delete file from Cloudinary: {str(e)}"
            )
    
    def get_notebook_url(self, public_id: str) -> str:
        """
        Get the URL for a notebook.
        
        Args:
            public_id: The public_id of the file
        
        Returns:
            Secure URL to the file
        """
        url, _ = cloudinary_url(
            public_id,
            resource_type="raw",
            secure=True
        )
        return url
    
    async def validate_notebook_content(self, file: UploadFile) -> Dict[str, any]:
        """
        Validate notebook content for required components.
        
        Args:
            file: The uploaded notebook file
        
        Returns:
            Dict with validation results
        """
        content = await file.read()
        await file.seek(0)  # Reset for later use
        
        try:
            notebook_data = json.loads(content)
        except json.JSONDecodeError:
            return {
                "valid": False,
                "errors": ["Invalid JSON format"]
            }
        
        errors = []
        warnings = []
        
        # Check for cells
        if 'cells' not in notebook_data:
            errors.append("Notebook must contain 'cells' field")
            return {"valid": False, "errors": errors}
        
        cells = notebook_data['cells']
        
        # Count code cells
        code_cells = [c for c in cells if c.get('cell_type') == 'code']
        markdown_cells = [c for c in cells if c.get('cell_type') == 'markdown']
        
        if len(code_cells) == 0:
            errors.append("Notebook must contain at least one code cell")
        
        # Check for financial analysis indicators
        has_financial_analysis = False
        has_visualization = False
        
        for cell in code_cells:
            source = ''.join(cell.get('source', []))
            
            # Check for financial libraries
            if any(lib in source for lib in ['yfinance', 'pandas', 'numpy']):
                has_financial_analysis = True
            
            # Check for visualization
            if any(viz in source for viz in ['matplotlib', 'plt.', 'plot(', 'seaborn']):
                has_visualization = True
        
        if not has_financial_analysis:
            warnings.append("Notebook should include financial analysis (yfinance, pandas)")
        
        if not has_visualization:
            warnings.append("Notebook should include at least one visualization")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "stats": {
                "total_cells": len(cells),
                "code_cells": len(code_cells),
                "markdown_cells": len(markdown_cells),
                "has_financial_analysis": has_financial_analysis,
                "has_visualization": has_visualization
            }
        }
