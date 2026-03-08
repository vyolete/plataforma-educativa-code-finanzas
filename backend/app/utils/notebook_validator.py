"""
Notebook validation utilities for project submissions.

This module provides validation functions for Jupyter notebooks
to ensure they meet the requirements for different project types.
"""

import json
import re
from typing import Dict, Any, List


class NotebookValidator:
    """Validator for Jupyter notebook submissions"""
    
    @staticmethod
    def parse_notebook(notebook_content: str) -> Dict[str, Any]:
        """
        Parse notebook JSON content.
        
        Args:
            notebook_content: String content of the notebook
            
        Returns:
            Parsed notebook dictionary
            
        Raises:
            ValueError: If notebook is not valid JSON
        """
        try:
            notebook = json.loads(notebook_content)
            return notebook
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid notebook JSON: {str(e)}")
    
    @staticmethod
    def extract_code_cells(notebook: Dict[str, Any]) -> List[str]:
        """
        Extract all code cells from notebook.
        
        Args:
            notebook: Parsed notebook dictionary
            
        Returns:
            List of code cell contents as strings
        """
        if "cells" not in notebook:
            return []
        
        code_cells = []
        for cell in notebook["cells"]:
            if cell.get("cell_type") == "code":
                source = cell.get("source", [])
                if isinstance(source, list):
                    code_cells.append("".join(source))
                elif isinstance(source, str):
                    code_cells.append(source)
        
        return code_cells
    
    @staticmethod
    def count_pattern_matches(code: str, patterns: List[str]) -> int:
        """
        Count matches of regex patterns in code.
        
        Args:
            code: Code string to search
            patterns: List of regex patterns
            
        Returns:
            Total count of matches
        """
        count = 0
        for pattern in patterns:
            matches = re.findall(pattern, code, re.IGNORECASE)
            count += len(matches)
        return count
    
    @staticmethod
    def check_pandas_usage(code: str) -> Dict[str, Any]:
        """
        Check for Pandas usage in code.
        
        Args:
            code: Combined code from all cells
            
        Returns:
            Dict with pandas usage details
        """
        pandas_patterns = [
            r'import\s+pandas',
            r'from\s+pandas',
            r'pd\.DataFrame',
            r'pd\.Series',
            r'pd\.read_csv',
            r'pd\.read_excel',
            r'pd\.read_json',
            r'\.head\(',
            r'\.tail\(',
            r'\.describe\(',
            r'\.info\(',
            r'\.groupby\(',
            r'\.merge\(',
            r'\.join\(',
            r'\.concat\(',
            r'\.loc\[',
            r'\.iloc\[',
            r'\.drop\(',
            r'\.fillna\(',
            r'\.dropna\(',
            r'\.sort_values\(',
            r'\.value_counts\(',
        ]
        
        count = NotebookValidator.count_pattern_matches(code, pandas_patterns)
        
        return {
            "has_pandas": count > 0,
            "operations_count": count,
            "has_import": bool(re.search(r'import\s+pandas|from\s+pandas', code, re.IGNORECASE))
        }
    
    @staticmethod
    def check_visualizations(code: str) -> Dict[str, Any]:
        """
        Check for visualization code.
        
        Args:
            code: Combined code from all cells
            
        Returns:
            Dict with visualization details
        """
        matplotlib_patterns = [
            r'plt\.plot\(',
            r'plt\.bar\(',
            r'plt\.barh\(',
            r'plt\.scatter\(',
            r'plt\.hist\(',
            r'plt\.pie\(',
            r'plt\.line\(',
            r'plt\.boxplot\(',
            r'plt\.violinplot\(',
            r'plt\.heatmap\(',
        ]
        
        pandas_plot_patterns = [
            r'\.plot\(',
            r'\.plot\.line\(',
            r'\.plot\.bar\(',
            r'\.plot\.scatter\(',
            r'\.plot\.hist\(',
            r'\.plot\.box\(',
            r'\.plot\.pie\(',
        ]
        
        seaborn_patterns = [
            r'sns\.lineplot\(',
            r'sns\.barplot\(',
            r'sns\.scatterplot\(',
            r'sns\.histplot\(',
            r'sns\.boxplot\(',
            r'sns\.heatmap\(',
            r'sns\.pairplot\(',
        ]
        
        matplotlib_count = NotebookValidator.count_pattern_matches(code, matplotlib_patterns)
        pandas_count = NotebookValidator.count_pattern_matches(code, pandas_plot_patterns)
        seaborn_count = NotebookValidator.count_pattern_matches(code, seaborn_patterns)
        
        total_count = matplotlib_count + pandas_count + seaborn_count
        
        return {
            "has_visualizations": total_count > 0,
            "total_count": total_count,
            "matplotlib_count": matplotlib_count,
            "pandas_plot_count": pandas_count,
            "seaborn_count": seaborn_count,
            "has_import": bool(re.search(r'import\s+matplotlib|from\s+matplotlib', code, re.IGNORECASE))
        }
    
    @staticmethod
    def check_yfinance_usage(code: str) -> Dict[str, Any]:
        """
        Check for yfinance usage in code.
        
        Args:
            code: Combined code from all cells
            
        Returns:
            Dict with yfinance usage details
        """
        yfinance_patterns = [
            r'import\s+yfinance',
            r'from\s+yfinance',
            r'yf\.download\(',
            r'yf\.Ticker\(',
            r'\.history\(',
            r'\.info\b',
        ]
        
        count = NotebookValidator.count_pattern_matches(code, yfinance_patterns)
        
        return {
            "has_yfinance": count > 0,
            "operations_count": count,
            "has_import": bool(re.search(r'import\s+yfinance|from\s+yfinance', code, re.IGNORECASE))
        }
    
    @staticmethod
    def validate_trabajo_1(notebook_content: str) -> Dict[str, Any]:
        """
        Validate Trabajo 1 requirements.
        
        Requirements:
        - Valid notebook structure
        - Pandas usage (DataFrame/Series operations)
        - At least 2 visualizations
        
        Args:
            notebook_content: String content of the notebook
            
        Returns:
            Validation result dictionary
        """
        result = {
            "is_valid": True,
            "missing_components": [],
            "warnings": [],
            "details": {
                "has_valid_structure": False,
                "has_pandas": False,
                "pandas_operations_count": 0,
                "has_visualizations": False,
                "visualization_count": 0,
            }
        }
        
        try:
            # Parse notebook
            notebook = NotebookValidator.parse_notebook(notebook_content)
            result["details"]["has_valid_structure"] = True
            
            # Extract code
            code_cells = NotebookValidator.extract_code_cells(notebook)
            
            if not code_cells:
                result["is_valid"] = False
                result["missing_components"].append(
                    "El notebook no contiene celdas de código"
                )
                return result
            
            all_code = "\n".join(code_cells)
            
            # Check Pandas
            pandas_check = NotebookValidator.check_pandas_usage(all_code)
            result["details"]["has_pandas"] = pandas_check["has_pandas"]
            result["details"]["pandas_operations_count"] = pandas_check["operations_count"]
            
            if not pandas_check["has_pandas"]:
                result["is_valid"] = False
                result["missing_components"].append(
                    "No se detectó uso de Pandas (DataFrame, Series, operaciones de datos)"
                )
            elif not pandas_check["has_import"]:
                result["warnings"].append(
                    "No se encontró importación explícita de Pandas. Verifique que el código sea ejecutable."
                )
            
            if pandas_check["operations_count"] < 5:
                result["warnings"].append(
                    "Se detectaron pocas operaciones de Pandas. Considere incluir más análisis de datos."
                )
            
            # Check visualizations
            viz_check = NotebookValidator.check_visualizations(all_code)
            result["details"]["has_visualizations"] = viz_check["total_count"] >= 2
            result["details"]["visualization_count"] = viz_check["total_count"]
            
            if viz_check["total_count"] < 2:
                result["is_valid"] = False
                result["missing_components"].append(
                    f"Se requieren al menos 2 visualizaciones (se encontraron {viz_check['total_count']})"
                )
            elif viz_check["total_count"] == 2:
                result["warnings"].append(
                    "Se encontraron exactamente 2 visualizaciones (mínimo requerido). "
                    "Se recomienda incluir 3-4 para un análisis más completo."
                )
            
            if viz_check["has_visualizations"] and not viz_check["has_import"]:
                result["warnings"].append(
                    "No se encontró importación de matplotlib. Verifique que las visualizaciones sean ejecutables."
                )
            
        except ValueError as e:
            result["is_valid"] = False
            result["missing_components"].append(str(e))
        except Exception as e:
            result["is_valid"] = False
            result["missing_components"].append(
                f"Error inesperado durante la validación: {str(e)}"
            )
        
        return result
    
    @staticmethod
    def validate_trabajo_2(notebook_content: str) -> Dict[str, Any]:
        """
        Validate Trabajo 2 requirements.
        
        Requirements:
        - Valid notebook structure
        - yfinance usage for data retrieval
        - Multiple visualizations (3+)
        - Financial analysis
        
        Args:
            notebook_content: String content of the notebook
            
        Returns:
            Validation result dictionary
        """
        result = {
            "is_valid": True,
            "missing_components": [],
            "warnings": [],
            "details": {
                "has_valid_structure": False,
                "has_yfinance": False,
                "has_pandas": False,
                "has_visualizations": False,
                "visualization_count": 0,
            }
        }
        
        try:
            # Parse notebook
            notebook = NotebookValidator.parse_notebook(notebook_content)
            result["details"]["has_valid_structure"] = True
            
            # Extract code
            code_cells = NotebookValidator.extract_code_cells(notebook)
            
            if not code_cells:
                result["is_valid"] = False
                result["missing_components"].append(
                    "El notebook no contiene celdas de código"
                )
                return result
            
            all_code = "\n".join(code_cells)
            
            # Check yfinance
            yf_check = NotebookValidator.check_yfinance_usage(all_code)
            result["details"]["has_yfinance"] = yf_check["has_yfinance"]
            
            if not yf_check["has_yfinance"]:
                result["is_valid"] = False
                result["missing_components"].append(
                    "No se detectó uso de yfinance para obtención de datos financieros"
                )
            
            # Check Pandas
            pandas_check = NotebookValidator.check_pandas_usage(all_code)
            result["details"]["has_pandas"] = pandas_check["has_pandas"]
            
            if not pandas_check["has_pandas"]:
                result["warnings"].append(
                    "No se detectó uso de Pandas. Se recomienda para análisis de datos."
                )
            
            # Check visualizations (Trabajo 2 requires more)
            viz_check = NotebookValidator.check_visualizations(all_code)
            result["details"]["has_visualizations"] = viz_check["total_count"] >= 3
            result["details"]["visualization_count"] = viz_check["total_count"]
            
            if viz_check["total_count"] < 3:
                result["is_valid"] = False
                result["missing_components"].append(
                    f"Se requieren al menos 3 visualizaciones para Trabajo 2 (se encontraron {viz_check['total_count']})"
                )
            
        except ValueError as e:
            result["is_valid"] = False
            result["missing_components"].append(str(e))
        except Exception as e:
            result["is_valid"] = False
            result["missing_components"].append(
                f"Error inesperado durante la validación: {str(e)}"
            )
        
        return result
