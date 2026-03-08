"""
Tests for Google Colab integration service
"""
import pytest
from app.services.colab_service import ColabService


class TestColabService:
    """Test cases for ColabService"""
    
    def test_export_simple_code(self):
        """Test exporting simple Python code to notebook format"""
        code = """
import pandas as pd

# Load data
df = pd.DataFrame({'A': [1, 2, 3], 'B': [4, 5, 6]})
print(df.head())
"""
        service = ColabService()
        notebook = service.export_to_notebook(code)
        
        # Verify notebook structure
        assert 'cells' in notebook
        assert 'metadata' in notebook
        assert 'nbformat' in notebook
        assert notebook['nbformat'] == 4
        
        # Verify cells exist
        assert len(notebook['cells']) > 0
        
        # Verify first cell has imports
        first_cell = notebook['cells'][0]
        assert first_cell['cell_type'] == 'code'
        source_text = ''.join(first_cell['source'])
        assert 'import yfinance' in source_text or 'import pandas' in source_text
    
    def test_export_with_metadata(self):
        """Test exporting code with custom metadata"""
        code = "print('Hello, World!')"
        metadata = {
            'exercise_id': 123,
            'module_id': 1,
            'user_id': 456
        }
        
        service = ColabService()
        notebook = service.export_to_notebook(code, metadata)
        
        # Verify custom metadata is included
        assert 'plataforma_educativa' in notebook['metadata']
        assert notebook['metadata']['plataforma_educativa']['exercise_id'] == 123
        assert notebook['metadata']['plataforma_educativa']['module_id'] == 1
        assert 'exported_at' in notebook['metadata']['plataforma_educativa']
    
    def test_export_with_comments(self):
        """Test that comments are converted to markdown cells"""
        code = """
# This is a comment
# Another comment line

x = 5
print(x)
"""
        service = ColabService()
        notebook = service.export_to_notebook(code)
        
        # Check that we have both markdown and code cells
        cell_types = [cell['cell_type'] for cell in notebook['cells']]
        assert 'markdown' in cell_types
        assert 'code' in cell_types
    
    def test_import_simple_notebook(self):
        """Test importing code from a simple notebook"""
        notebook_data = {
            'cells': [
                {
                    'cell_type': 'code',
                    'source': ['import pandas as pd\n', 'print("Hello")']
                },
                {
                    'cell_type': 'markdown',
                    'source': ['# This is a title\n', 'Some description']
                },
                {
                    'cell_type': 'code',
                    'source': ['x = 5\n', 'print(x)']
                }
            ],
            'metadata': {},
            'nbformat': 4,
            'nbformat_minor': 0
        }
        
        service = ColabService()
        result = service.import_from_notebook(notebook_data)
        
        # Verify code is extracted
        assert 'code' in result
        assert 'metadata' in result
        assert 'import pandas' in result['code']
        assert 'x = 5' in result['code']
        
        # Verify markdown is converted to comments
        assert '"""' in result['code']
    
    def test_import_with_metadata(self):
        """Test importing notebook with custom metadata"""
        notebook_data = {
            'cells': [
                {
                    'cell_type': 'code',
                    'source': ['print("test")']
                }
            ],
            'metadata': {
                'plataforma_educativa': {
                    'exercise_id': 789,
                    'module_id': 2
                }
            },
            'nbformat': 4,
            'nbformat_minor': 0
        }
        
        service = ColabService()
        result = service.import_from_notebook(notebook_data)
        
        # Verify metadata is extracted
        assert result['metadata']['exercise_id'] == 789
        assert result['metadata']['module_id'] == 2
    
    def test_validate_valid_syntax(self):
        """Test syntax validation with valid code"""
        code = """
import pandas as pd

def calculate_returns(prices):
    return prices.pct_change()

df = pd.DataFrame({'price': [100, 105, 103]})
returns = calculate_returns(df['price'])
print(returns)
"""
        service = ColabService()
        result = service.validate_notebook_syntax(code)
        
        assert result['valid'] is True
        assert 'error' not in result
    
    def test_validate_invalid_syntax(self):
        """Test syntax validation with invalid code"""
        code = """
def broken_function(
    print("missing closing parenthesis"
"""
        service = ColabService()
        result = service.validate_notebook_syntax(code)
        
        assert result['valid'] is False
        assert 'error' in result
    
    def test_validate_colab_url_valid(self):
        """Test validation of valid Colab URLs"""
        service = ColabService()
        
        valid_urls = [
            'https://colab.research.google.com/drive/1234567890',
            'https://colab.research.google.com/github/user/repo/blob/main/notebook.ipynb',
            'https://colab.research.google.com/gist/user/1234567890'
        ]
        
        for url in valid_urls:
            assert service.validate_colab_url(url) is True
    
    def test_validate_colab_url_invalid(self):
        """Test validation of invalid URLs"""
        service = ColabService()
        
        invalid_urls = [
            'https://google.com',
            'https://github.com/user/repo',
            'http://colab.research.google.com/drive/123',  # http instead of https
            'not a url at all'
        ]
        
        for url in invalid_urls:
            assert service.validate_colab_url(url) is False
    
    def test_round_trip_preservation(self):
        """Test that export -> import preserves code structure"""
        original_code = """
import yfinance as yf
import pandas as pd

# Download stock data
ticker = "AAPL"
data = yf.download(ticker, start="2020-01-01", end="2023-12-31")

# Calculate returns
returns = data['Close'].pct_change()
print(returns.describe())
"""
        service = ColabService()
        
        # Export to notebook
        notebook = service.export_to_notebook(original_code)
        
        # Import back
        result = service.import_from_notebook(notebook)
        imported_code = result['code']
        
        # Verify key elements are preserved
        assert 'import yfinance' in imported_code
        assert 'import pandas' in imported_code
        assert 'yf.download' in imported_code
        assert 'pct_change()' in imported_code
        
        # Verify syntax is still valid
        validation = service.validate_notebook_syntax(imported_code)
        assert validation['valid'] is True
    
    def test_import_invalid_notebook_structure(self):
        """Test that invalid notebook structure raises appropriate error"""
        service = ColabService()
        
        # Missing cells field
        with pytest.raises(ValueError, match="missing 'cells' field"):
            service.import_from_notebook({'metadata': {}})
        
        # Cells is not a list
        with pytest.raises(ValueError, match="'cells' must be a list"):
            service.import_from_notebook({'cells': 'not a list'})
        
        # Not a dictionary
        with pytest.raises(ValueError, match="must be a dictionary"):
            service.import_from_notebook("not a dict")
