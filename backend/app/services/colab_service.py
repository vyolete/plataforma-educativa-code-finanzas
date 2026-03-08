"""
Service for Google Colab integration.
Handles export to .ipynb format and import from Colab notebooks.
"""
import json
import re
from typing import Dict, List, Any, Optional
from datetime import datetime


class ColabService:
    """Service for handling Google Colab notebook operations."""
    
    @staticmethod
    def export_to_notebook(
        code: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Export Python code to Jupyter notebook format (.ipynb).
        
        Args:
            code: Python code to export
            metadata: Optional metadata (exercise_id, module_id, etc.)
            
        Returns:
            Dictionary representing the notebook structure
        """
        cells = ColabService._parse_code_to_cells(code)
        
        # Add library imports as first cell if not present
        has_imports = any(
            'import' in cell.get('source', '') 
            for cell in cells 
            if cell.get('cell_type') == 'code'
        )
        
        if not has_imports:
            import_cell = {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "# Bibliotecas necesarias\n",
                    "import yfinance as yf\n",
                    "import pandas as pd\n",
                    "import matplotlib.pyplot as plt\n",
                    "import numpy as np\n"
                ]
            }
            cells.insert(0, import_cell)
        
        # Build notebook metadata
        notebook_metadata = {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "codemirror_mode": {
                    "name": "ipython",
                    "version": 3
                },
                "file_extension": ".py",
                "mimetype": "text/x-python",
                "name": "python",
                "nbconvert_exporter": "python",
                "pygments_lexer": "ipython3",
                "version": "3.11.0"
            },
            "colab": {
                "name": "Plataforma Educativa - Notebook",
                "provenance": []
            }
        }
        
        # Add custom metadata if provided
        if metadata:
            notebook_metadata["plataforma_educativa"] = {
                **metadata,
                "exported_at": datetime.utcnow().isoformat()
            }
        
        notebook = {
            "cells": cells,
            "metadata": notebook_metadata,
            "nbformat": 4,
            "nbformat_minor": 0
        }
        
        return notebook
    
    @staticmethod
    def _parse_code_to_cells(code: str) -> List[Dict[str, Any]]:
        """
        Parse Python code into notebook cells.
        Separates code and comments into appropriate cell types.
        
        Args:
            code: Python code string
            
        Returns:
            List of cell dictionaries
        """
        cells = []
        lines = code.split('\n')
        current_cell_lines = []
        current_cell_type = 'code'
        
        i = 0
        while i < len(lines):
            line = lines[i]
            
            # Check for markdown block comments (triple quotes)
            if line.strip().startswith('"""') or line.strip().startswith("'''"):
                # Save current code cell if exists
                if current_cell_lines and current_cell_type == 'code':
                    cells.append(ColabService._create_code_cell(current_cell_lines))
                    current_cell_lines = []
                
                # Extract markdown content
                quote_char = '"""' if '"""' in line else "'''"
                markdown_lines = []
                
                # Check if it's a single-line docstring
                if line.strip().count(quote_char) >= 2:
                    content = line.strip().replace(quote_char, '').strip()
                    if content:
                        markdown_lines.append(content)
                else:
                    # Multi-line docstring
                    i += 1
                    while i < len(lines) and quote_char not in lines[i]:
                        markdown_lines.append(lines[i])
                        i += 1
                
                if markdown_lines:
                    cells.append(ColabService._create_markdown_cell(markdown_lines))
                
                current_cell_lines = []
                current_cell_type = 'code'
            
            # Regular comment lines (convert to markdown if multiple consecutive)
            elif line.strip().startswith('#') and not line.strip().startswith('#!'):
                # Save current code cell if exists
                if current_cell_lines and current_cell_type == 'code':
                    cells.append(ColabService._create_code_cell(current_cell_lines))
                    current_cell_lines = []
                
                # Collect consecutive comment lines
                comment_lines = []
                while i < len(lines) and lines[i].strip().startswith('#'):
                    comment_text = lines[i].strip()[1:].strip()
                    if comment_text:
                        comment_lines.append(comment_text)
                    i += 1
                    
                if comment_lines:
                    cells.append(ColabService._create_markdown_cell(comment_lines))
                
                current_cell_lines = []
                current_cell_type = 'code'
                continue
            
            # Regular code line
            else:
                if line.strip() or current_cell_lines:  # Include line if not empty or if we have content
                    current_cell_lines.append(line)
            
            i += 1
        
        # Add remaining cell
        if current_cell_lines:
            if current_cell_type == 'code':
                cells.append(ColabService._create_code_cell(current_cell_lines))
        
        return cells if cells else [ColabService._create_code_cell([""])]
    
    @staticmethod
    def _create_code_cell(lines: List[str]) -> Dict[str, Any]:
        """Create a code cell from lines."""
        # Add newline to each line except the last
        source = [line + '\n' for line in lines[:-1]]
        if lines:
            source.append(lines[-1])
        
        return {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": source
        }
    
    @staticmethod
    def _create_markdown_cell(lines: List[str]) -> Dict[str, Any]:
        """Create a markdown cell from lines."""
        # Add newline to each line except the last
        source = [line + '\n' for line in lines[:-1]]
        if lines:
            source.append(lines[-1])
        
        return {
            "cell_type": "markdown",
            "metadata": {},
            "source": source
        }
    
    @staticmethod
    def import_from_notebook(notebook_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Import code from Jupyter notebook format.
        
        Args:
            notebook_data: Dictionary representing the notebook
            
        Returns:
            Dictionary with 'code' and 'metadata'
        """
        # Validate notebook structure
        if not isinstance(notebook_data, dict):
            raise ValueError("Invalid notebook format: must be a dictionary")
        
        if 'cells' not in notebook_data:
            raise ValueError("Invalid notebook format: missing 'cells' field")
        
        if not isinstance(notebook_data['cells'], list):
            raise ValueError("Invalid notebook format: 'cells' must be a list")
        
        cells = notebook_data['cells']
        code_lines = []
        
        for cell in cells:
            if not isinstance(cell, dict):
                continue
            
            cell_type = cell.get('cell_type', '')
            source = cell.get('source', [])
            
            # Convert source to list if it's a string
            if isinstance(source, str):
                source = source.split('\n')
            
            if cell_type == 'code':
                # Add code cell content
                code_text = ''.join(source)
                if code_text.strip():
                    code_lines.append(code_text)
                    if not code_text.endswith('\n'):
                        code_lines.append('\n')
            
            elif cell_type == 'markdown':
                # Convert markdown to Python comments
                markdown_text = ''.join(source).strip()
                if markdown_text:
                    # Add as block comment
                    code_lines.append('"""\n')
                    code_lines.append(markdown_text)
                    if not markdown_text.endswith('\n'):
                        code_lines.append('\n')
                    code_lines.append('"""\n')
        
        code = ''.join(code_lines).strip()
        
        # Extract metadata if present
        metadata = {}
        if 'metadata' in notebook_data:
            nb_metadata = notebook_data['metadata']
            if 'plataforma_educativa' in nb_metadata:
                metadata = nb_metadata['plataforma_educativa']
        
        return {
            'code': code,
            'metadata': metadata
        }
    
    @staticmethod
    def validate_notebook_syntax(code: str) -> Dict[str, Any]:
        """
        Validate Python syntax of imported code.
        
        Args:
            code: Python code string
            
        Returns:
            Dictionary with 'valid' boolean and optional 'error' message
        """
        try:
            compile(code, '<string>', 'exec')
            return {'valid': True}
        except SyntaxError as e:
            return {
                'valid': False,
                'error': f"Syntax error at line {e.lineno}: {e.msg}",
                'line': e.lineno,
                'offset': e.offset
            }
        except Exception as e:
            return {
                'valid': False,
                'error': str(e)
            }
    
    @staticmethod
    def validate_colab_url(url: str) -> bool:
        """
        Validate that a URL is a valid Google Colab URL.
        
        Args:
            url: URL string to validate
            
        Returns:
            True if valid Colab URL, False otherwise
        """
        colab_patterns = [
            r'^https://colab\.research\.google\.com/drive/',
            r'^https://colab\.research\.google\.com/github/',
            r'^https://colab\.research\.google\.com/gist/'
        ]
        
        return any(re.match(pattern, url) for pattern in colab_patterns)
