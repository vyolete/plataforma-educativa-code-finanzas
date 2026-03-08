# Trabajo 1 - Sistema de Validación

## Descripción General

El sistema de validación para Trabajo 1 verifica automáticamente que las entregas cumplan con los requisitos mínimos antes de ser calificadas por el profesor.

## Requisitos Validados

### 1. Estructura del Notebook
- ✓ Archivo es un notebook válido (.ipynb)
- ✓ Contiene estructura JSON válida
- ✓ Contiene celdas de código ejecutables

### 2. Uso de Pandas (Obligatorio)
El sistema detecta:
- Importación de pandas (`import pandas` o `from pandas`)
- Creación de DataFrames (`pd.DataFrame`)
- Operaciones de pandas:
  - `df.head()`, `df.tail()`, `df.describe()`, `df.info()`
  - `df.groupby()`, `df.merge()`, `df.join()`
  - Indexación: `df.loc[]`, `df.iloc[]`
  - Limpieza: `df.fillna()`, `df.dropna()`
  - Transformaciones: `df.sort_values()`, `df.value_counts()`

**Criterio de validación**: Debe detectarse al menos 1 operación de pandas.

**Advertencia**: Si se detectan menos de 5 operaciones, se sugiere incluir más análisis.

### 3. Visualizaciones (Mínimo 2)
El sistema detecta:

**Matplotlib:**
- `plt.plot()`, `plt.bar()`, `plt.scatter()`
- `plt.hist()`, `plt.pie()`, `plt.boxplot()`

**Pandas Plot:**
- `df.plot()`, `df.plot.bar()`, `df.plot.scatter()`
- `df.plot.hist()`, `df.plot.box()`

**Seaborn:**
- `sns.lineplot()`, `sns.barplot()`, `sns.scatterplot()`
- `sns.histplot()`, `sns.heatmap()`

**Criterio de validación**: Debe detectarse al menos 2 visualizaciones.

**Advertencia**: Si se detectan exactamente 2, se recomienda incluir 3-4 para un análisis más completo.

## Implementación Técnica

### Módulo: `app/utils/notebook_validator.py`

Clase principal: `NotebookValidator`

#### Métodos Principales

```python
# Validar Trabajo 1
result = NotebookValidator.validate_trabajo_1(notebook_content)

# Validar Trabajo 2
result = NotebookValidator.validate_trabajo_2(notebook_content)
```

#### Estructura de Respuesta

```python
{
    "is_valid": bool,  # True si cumple todos los requisitos
    "missing_components": [  # Lista de componentes faltantes
        "No se detectó uso de Pandas",
        "Se requieren al menos 2 visualizaciones"
    ],
    "warnings": [  # Advertencias (no bloquean la entrega)
        "Se detectaron pocas operaciones de Pandas",
        "No se encontró importación de matplotlib"
    ],
    "details": {  # Detalles específicos de la validación
        "has_valid_structure": bool,
        "has_pandas": bool,
        "pandas_operations_count": int,
        "has_visualizations": bool,
        "visualization_count": int
    }
}
```

### Integración con Submission Service

El `SubmissionService` utiliza el validador:

```python
from app.services.submission_service import SubmissionService

service = SubmissionService(db)

# Validar contenido antes de crear la entrega
validation = service.validate_submission_content(
    submission_type="Trabajo_1",
    notebook_content=notebook_json_string
)

if not validation["is_valid"]:
    # Notificar al equipo sobre componentes faltantes
    missing = validation["missing_components"]
```

## Flujo de Validación

```
1. Estudiante sube notebook (.ipynb)
   ↓
2. Sistema lee el contenido del archivo
   ↓
3. Validador parsea el JSON del notebook
   ↓
4. Extrae todas las celdas de código
   ↓
5. Busca patrones de Pandas usando regex
   ↓
6. Busca patrones de visualización usando regex
   ↓
7. Genera reporte de validación
   ↓
8. Si is_valid = False:
   - Muestra componentes faltantes al equipo
   - Permite corregir y volver a subir
   ↓
9. Si is_valid = True:
   - Permite confirmación por miembros del equipo
   - Marca entrega como lista para calificación
```

## Ejemplos de Validación

### Ejemplo 1: Entrega Válida

```python
# Notebook contiene:
import pandas as pd
import matplotlib.pyplot as plt

df = pd.read_csv('data.csv')
df.head()
df.describe()
df.groupby('category').sum()

plt.plot(df['date'], df['value'])
plt.bar(df['category'], df['count'])
```

**Resultado:**
```python
{
    "is_valid": True,
    "missing_components": [],
    "warnings": [],
    "details": {
        "has_pandas": True,
        "pandas_operations_count": 5,
        "has_visualizations": True,
        "visualization_count": 2
    }
}
```

### Ejemplo 2: Falta Pandas

```python
# Notebook contiene solo:
import matplotlib.pyplot as plt

plt.plot([1, 2, 3])
plt.bar([1, 2], [3, 4])
```

**Resultado:**
```python
{
    "is_valid": False,
    "missing_components": [
        "No se detectó uso de Pandas (DataFrame, Series, operaciones de datos)"
    ],
    "warnings": [],
    "details": {
        "has_pandas": False,
        "pandas_operations_count": 0,
        "has_visualizations": True,
        "visualization_count": 2
    }
}
```

### Ejemplo 3: Faltan Visualizaciones

```python
# Notebook contiene:
import pandas as pd

df = pd.DataFrame({'A': [1, 2, 3]})
df.head()
df.describe()
```

**Resultado:**
```python
{
    "is_valid": False,
    "missing_components": [
        "Se requieren al menos 2 visualizaciones (se encontraron 0)"
    ],
    "warnings": [
        "Se detectaron pocas operaciones de Pandas. Considere incluir más análisis de datos."
    ],
    "details": {
        "has_pandas": True,
        "pandas_operations_count": 2,
        "has_visualizations": False,
        "visualization_count": 0
    }
}
```

## Extensibilidad

El sistema está diseñado para ser extensible:

### Agregar Validación para Trabajo 2

```python
# En notebook_validator.py
@staticmethod
def validate_trabajo_2(notebook_content: str) -> Dict[str, Any]:
    # Trabajo 2 requiere:
    # - yfinance para datos financieros
    # - Al menos 3 visualizaciones
    # - Análisis más complejo
    pass
```

### Agregar Nuevos Patrones

```python
# Agregar detección de nuevas bibliotecas
plotly_patterns = [
    r'plotly\.express\.',
    r'plotly\.graph_objects\.',
    r'px\.line\(',
    r'go\.Figure\('
]
```

## Limitaciones

1. **Validación Sintáctica**: El sistema solo verifica que el código contenga los patrones esperados, no ejecuta el código.

2. **Falsos Positivos**: Código comentado o en strings puede ser detectado.

3. **Falsos Negativos**: Código muy creativo o con alias no estándar puede no ser detectado.

4. **No Valida Calidad**: El sistema no evalúa la calidad del análisis, solo la presencia de componentes requeridos.

## Mejoras Futuras

1. **Ejecución de Código**: Ejecutar el notebook en un sandbox para verificar que funciona.

2. **Análisis AST**: Usar Abstract Syntax Tree para análisis más preciso.

3. **Validación de Calidad**: Verificar que las visualizaciones tienen títulos, etiquetas, etc.

4. **Detección de Plagio**: Comparar con entregas anteriores.

5. **Sugerencias Automáticas**: Generar sugerencias específicas basadas en lo que falta.

## Soporte

Para dudas sobre el sistema de validación:
- Revisar esta documentación
- Consultar `backend/docs/trabajo-1-specification.md` para requisitos completos
- Revisar el código en `backend/app/utils/notebook_validator.py`
