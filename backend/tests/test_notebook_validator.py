"""
Tests for notebook validation utilities.
"""

import json
import pytest
from app.utils.notebook_validator import NotebookValidator


def create_test_notebook(code_cells):
    """Helper to create a test notebook with given code cells"""
    return json.dumps({
        "cells": [
            {
                "cell_type": "code",
                "source": code,
                "metadata": {},
                "outputs": []
            }
            for code in code_cells
        ],
        "metadata": {},
        "nbformat": 4,
        "nbformat_minor": 4
    })


class TestNotebookValidator:
    
    def test_parse_valid_notebook(self):
        """Test parsing a valid notebook"""
        notebook_content = create_test_notebook(["print('hello')"])
        notebook = NotebookValidator.parse_notebook(notebook_content)
        assert "cells" in notebook
        assert len(notebook["cells"]) == 1
    
    def test_parse_invalid_notebook(self):
        """Test parsing invalid JSON raises ValueError"""
        with pytest.raises(ValueError):
            NotebookValidator.parse_notebook("invalid json")
    
    def test_extract_code_cells(self):
        """Test extracting code cells from notebook"""
        notebook = {
            "cells": [
                {"cell_type": "code", "source": ["print('hello')"]},
                {"cell_type": "markdown", "source": ["# Title"]},
                {"cell_type": "code", "source": ["x = 5"]}
            ]
        }
        code_cells = NotebookValidator.extract_code_cells(notebook)
        assert len(code_cells) == 2
        assert "print('hello')" in code_cells[0]
        assert "x = 5" in code_cells[1]
    
    def test_check_pandas_usage_positive(self):
        """Test detecting Pandas usage"""
        code = """
import pandas as pd
df = pd.DataFrame({'A': [1, 2, 3]})
df.head()
df.describe()
        """
        result = NotebookValidator.check_pandas_usage(code)
        assert result["has_pandas"] is True
        assert result["operations_count"] > 0
        assert result["has_import"] is True
    
    def test_check_pandas_usage_negative(self):
        """Test when no Pandas is used"""
        code = "print('hello world')"
        result = NotebookValidator.check_pandas_usage(code)
        assert result["has_pandas"] is False
        assert result["operations_count"] == 0
    
    def test_check_visualizations_matplotlib(self):
        """Test detecting matplotlib visualizations"""
        code = """
import matplotlib.pyplot as plt
plt.plot([1, 2, 3])
plt.bar([1, 2], [3, 4])
plt.show()
        """
        result = NotebookValidator.check_visualizations(code)
        assert result["has_visualizations"] is True
        assert result["total_count"] >= 2
        assert result["matplotlib_count"] >= 2
    
    def test_check_visualizations_pandas_plot(self):
        """Test detecting pandas plot methods"""
        code = """
import pandas as pd
df = pd.DataFrame({'A': [1, 2, 3]})
df.plot()
df.plot.bar()
        """
        result = NotebookValidator.check_visualizations(code)
        assert result["has_visualizations"] is True
        assert result["pandas_plot_count"] >= 2
    
    def test_validate_trabajo_1_valid(self):
        """Test validating a valid Trabajo 1 submission"""
        code_cells = [
            ["import pandas as pd\nimport matplotlib.pyplot as plt"],
            ["df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})"],
            ["df.head()\ndf.describe()\ndf.groupby('A').sum()"],
            ["plt.plot(df['A'], df['B'])"],
            ["plt.bar(df['A'], df['B'])"]
        ]
        notebook_content = create_test_notebook(code_cells)
        
        result = NotebookValidator.validate_trabajo_1(notebook_content)
        assert result["is_valid"] is True
        assert len(result["missing_components"]) == 0
        assert result["details"]["has_pandas"] is True
        assert result["details"]["has_visualizations"] is True
        assert result["details"]["visualization_count"] >= 2
    
    def test_validate_trabajo_1_missing_pandas(self):
        """Test validation fails when Pandas is missing"""
        code_cells = [
            ["import matplotlib.pyplot as plt"],
            ["plt.plot([1, 2, 3])"],
            ["plt.bar([1, 2], [3, 4])"]
        ]
        notebook_content = create_test_notebook(code_cells)
        
        result = NotebookValidator.validate_trabajo_1(notebook_content)
        assert result["is_valid"] is False
        assert any("Pandas" in comp for comp in result["missing_components"])
    
    def test_validate_trabajo_1_insufficient_visualizations(self):
        """Test validation fails with less than 2 visualizations"""
        code_cells = [
            ["import pandas as pd"],
            ["df = pd.DataFrame({'A': [1, 2, 3]})"],
            ["df.head()"],
            ["import matplotlib.pyplot as plt"],
            ["plt.plot([1, 2, 3])"]  # Only 1 visualization
        ]
        notebook_content = create_test_notebook(code_cells)
        
        result = NotebookValidator.validate_trabajo_1(notebook_content)
        assert result["is_valid"] is False
        assert any("visualizaciones" in comp for comp in result["missing_components"])
    
    def test_validate_trabajo_1_invalid_structure(self):
        """Test validation fails with invalid notebook structure"""
        invalid_notebook = json.dumps({"invalid": "structure"})
        
        result = NotebookValidator.validate_trabajo_1(invalid_notebook)
        assert result["is_valid"] is False
    
    def test_validate_trabajo_2_valid(self):
        """Test validating a valid Trabajo 2 submission"""
        code_cells = [
            ["import yfinance as yf\nimport pandas as pd\nimport matplotlib.pyplot as plt"],
            ["data = yf.download('JPM', start='2020-01-01', end='2023-12-31')"],
            ["data.head()\ndata.describe()"],
            ["plt.plot(data['Close'])"],
            ["plt.bar(range(len(data)), data['Volume'])"],
            ["data['Close'].plot()"]  # 3rd visualization
        ]
        notebook_content = create_test_notebook(code_cells)
        
        result = NotebookValidator.validate_trabajo_2(notebook_content)
        assert result["is_valid"] is True
        assert result["details"]["has_yfinance"] is True
        assert result["details"]["visualization_count"] >= 3
    
    def test_validate_trabajo_2_missing_yfinance(self):
        """Test Trabajo 2 validation fails without yfinance"""
        code_cells = [
            ["import pandas as pd\nimport matplotlib.pyplot as plt"],
            ["df = pd.DataFrame({'A': [1, 2, 3]})"],
            ["plt.plot([1, 2, 3])"],
            ["plt.bar([1, 2], [3, 4])"],
            ["plt.scatter([1, 2], [3, 4])"]
        ]
        notebook_content = create_test_notebook(code_cells)
        
        result = NotebookValidator.validate_trabajo_2(notebook_content)
        assert result["is_valid"] is False
        assert any("yfinance" in comp for comp in result["missing_components"])
    
    def test_check_yfinance_usage(self):
        """Test detecting yfinance usage"""
        code = """
import yfinance as yf
ticker = yf.Ticker('JPM')
data = yf.download('JPM', start='2020-01-01')
info = ticker.info
        """
        result = NotebookValidator.check_yfinance_usage(code)
        assert result["has_yfinance"] is True
        assert result["operations_count"] > 0
        assert result["has_import"] is True
