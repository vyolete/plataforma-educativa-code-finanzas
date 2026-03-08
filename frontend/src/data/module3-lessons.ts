// Module 3: Introducción a Pandas - Lessons
// This file contains the 4 lessons for Module 3

import { Lesson } from './lessons';

export const module3Lessons: Lesson[] = [
  {
    id: '3-1',
    moduleId: '3',
    title: 'DataFrames y Series',
    orderIndex: 1,
    content: `# DataFrames y Series en Pandas

## ¿Qué aprenderás?

- Entender qué es Pandas y por qué es fundamental para análisis de datos
- Crear y manipular Series (datos unidimensionales)
- Crear y manipular DataFrames (datos tabulares)
- Acceder a datos con indexing y slicing
- Aplicar operaciones básicas a DataFrames

## ¿Qué construirás?

Crearás un DataFrame con datos de acciones bancarias y realizarás análisis básicos de precios y rendimientos.

**Nivel de dificultad:** Principiante

---

## Introducción a Pandas

**Pandas** es la biblioteca más importante de Python para análisis de datos. Proporciona estructuras de datos potentes y fáciles de usar para manipular datos tabulares, similar a Excel o SQL, pero con mucho más poder y flexibilidad.

### ¿Por qué Pandas?

- **Manejo de datos tabulares**: Trabaja con datos como en Excel
- **Análisis financiero**: Ideal para series temporales y datos de mercado
- **Integración**: Funciona perfectamente con yfinance, matplotlib y numpy
- **Rendimiento**: Operaciones rápidas en grandes volúmenes de datos

\`\`\`python
# Importar pandas (convención: usar alias 'pd')
import pandas as pd

print(f"Versión de Pandas: {pd.__version__}")
\`\`\`

## Series: Datos Unidimensionales

Una **Series** es un array unidimensional con etiquetas (índices). Piensa en ella como una columna de Excel con nombres de fila.

### Crear Series

\`\`\`python
import pandas as pd

# Crear Series desde una lista
precios = pd.Series([150.0, 35.0, 50.0, 45.0])
print(precios)
# 0    150.0
# 1     35.0
# 2     50.0
# 3     45.0
# dtype: float64

# Crear Series con índices personalizados
precios_acciones = pd.Series(
    [150.0, 35.0, 50.0, 45.0],
    index=['JPM', 'BAC', 'C', 'WFC']
)
print(precios_acciones)
# JPM    150.0
# BAC     35.0
# C       50.0
# WFC     45.0
# dtype: float64

# Crear Series desde un diccionario
precios_dict = {
    'JPM': 150.0,
    'BAC': 35.0,
    'C': 50.0,
    'WFC': 45.0
}
precios_series = pd.Series(precios_dict)
print(precios_series)
\`\`\`

### Acceder a Elementos de Series

\`\`\`python
precios = pd.Series(
    [150.0, 35.0, 50.0, 45.0],
    index=['JPM', 'BAC', 'C', 'WFC']
)

# Acceso por etiqueta
precio_jpm = precios['JPM']  # 150.0
precio_bac = precios['BAC']  # 35.0

# Acceso por posición
primer_precio = precios[0]   # 150.0
ultimo_precio = precios[-1]  # 45.0

# Acceso múltiple
bancos_grandes = precios[['JPM', 'BAC']]
print(bancos_grandes)
# JPM    150.0
# BAC     35.0
# dtype: float64

# Slicing
primeros_tres = precios[:3]
print(primeros_tres)
\`\`\`

### Operaciones con Series

\`\`\`python
precios = pd.Series([150.0, 35.0, 50.0, 45.0], 
                    index=['JPM', 'BAC', 'C', 'WFC'])

# Operaciones aritméticas (se aplican a todos los elementos)
precios_con_comision = precios * 1.01
print(precios_con_comision)

# Filtrado
precios_altos = precios[precios > 40]
print(precios_altos)
# JPM    150.0
# C       50.0
# WFC     45.0
# dtype: float64

# Estadísticas
print(f"Precio promedio: ${precios.mean():.2f}")
print(f"Precio máximo: ${precios.max():.2f}")
print(f"Precio mínimo: ${precios.min():.2f}")
print(f"Desviación estándar: ${precios.std():.2f}")
\`\`\`

## DataFrames: Datos Tabulares

Un **DataFrame** es una tabla bidimensional con filas y columnas etiquetadas. Es la estructura principal de Pandas y similar a una hoja de Excel o tabla SQL.

### Crear DataFrames

\`\`\`python
import pandas as pd

# Desde un diccionario (cada clave es una columna)
datos = {
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0],
    'cantidad': [10, 20, 15, 12]
}
df = pd.DataFrame(datos)
print(df)
#   ticker  precio  cantidad
# 0    JPM   150.0        10
# 1    BAC    35.0        20
# 2      C    50.0        15
# 3    WFC    45.0        12

# Desde una lista de diccionarios (cada diccionario es una fila)
acciones = [
    {'ticker': 'JPM', 'precio': 150.0, 'cantidad': 10},
    {'ticker': 'BAC', 'precio': 35.0, 'cantidad': 20},
    {'ticker': 'C', 'precio': 50.0, 'cantidad': 15}
]
df = pd.DataFrame(acciones)
print(df)

# Con índice personalizado
df = pd.DataFrame(datos, index=['A', 'B', 'C', 'D'])
print(df)
\`\`\`

### Explorar DataFrames

\`\`\`python
# Crear DataFrame de ejemplo
portafolio = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'nombre': ['JPMorgan', 'Bank of America', 'Citigroup', 'Wells Fargo', 'Goldman Sachs'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0],
    'cantidad': [10, 20, 15, 12, 5],
    'sector': ['Banca', 'Banca', 'Banca', 'Banca', 'Banca']
})

# Ver primeras filas
print(portafolio.head())  # Primeras 5 filas (por defecto)
print(portafolio.head(3))  # Primeras 3 filas

# Ver últimas filas
print(portafolio.tail())  # Últimas 5 filas

# Información del DataFrame
print(portafolio.info())
# <class 'pandas.core.frame.DataFrame'>
# RangeIndex: 5 entries, 0 to 4
# Data columns (total 5 columns):
#  #   Column    Non-Null Count  Dtype  
# ---  ------    --------------  -----  
#  0   ticker    5 non-null      object 
#  1   nombre    5 non-null      object 
#  2   precio    5 non-null      float64
#  3   cantidad  5 non-null      int64  
#  4   sector    5 non-null      object 
# dtypes: float64(1), int64(1), object(3)

# Dimensiones
print(f"Filas: {portafolio.shape[0]}, Columnas: {portafolio.shape[1]}")

# Nombres de columnas
print(portafolio.columns.tolist())
# ['ticker', 'nombre', 'precio', 'cantidad', 'sector']

# Estadísticas descriptivas
print(portafolio.describe())
#           precio   cantidad
# count   5.000000   5.000000
# mean  132.000000  12.400000
# std   142.478916   5.941380
# min    35.000000   5.000000
# 25%    45.000000  10.000000
# 50%    50.000000  12.000000
# 75%   150.000000  15.000000
# max   380.000000  20.000000
\`\`\`


### Acceder a Columnas

\`\`\`python
# Acceder a una columna (retorna Series)
precios = portafolio['precio']
print(type(precios))  # <class 'pandas.core.series.Series'>

# Notación de punto (solo si el nombre no tiene espacios)
tickers = portafolio.ticker
print(tickers)

# Acceder a múltiples columnas (retorna DataFrame)
info_basica = portafolio[['ticker', 'precio']]
print(info_basica)
#   ticker  precio
# 0    JPM   150.0
# 1    BAC    35.0
# 2      C    50.0
# 3    WFC    45.0
# 4     GS   380.0
\`\`\`

### Acceder a Filas

\`\`\`python
# loc: acceso por etiqueta de índice
primera_fila = portafolio.loc[0]
print(primera_fila)
# ticker          JPM
# nombre     JPMorgan
# precio        150.0
# cantidad         10
# sector        Banca
# Name: 0, dtype: object

# iloc: acceso por posición numérica
primera_fila = portafolio.iloc[0]
ultima_fila = portafolio.iloc[-1]

# Múltiples filas
primeras_tres = portafolio.loc[0:2]  # Incluye el 2
primeras_tres = portafolio.iloc[0:3]  # Excluye el 3
\`\`\`

### Acceder a Celdas Específicas

\`\`\`python
# loc[fila, columna]
precio_jpm = portafolio.loc[0, 'precio']  # 150.0

# iloc[fila, columna]
precio_jpm = portafolio.iloc[0, 2]  # 150.0

# Múltiples celdas
datos = portafolio.loc[0:2, ['ticker', 'precio']]
print(datos)
#   ticker  precio
# 0    JPM   150.0
# 1    BAC    35.0
# 2      C    50.0
\`\`\`

## Operaciones Básicas con DataFrames

### Agregar Columnas

\`\`\`python
# Calcular valor de cada posición
portafolio['valor'] = portafolio['precio'] * portafolio['cantidad']
print(portafolio[['ticker', 'precio', 'cantidad', 'valor']])
#   ticker  precio  cantidad    valor
# 0    JPM   150.0        10  1500.0
# 1    BAC    35.0        20   700.0
# 2      C    50.0        15   750.0
# 3    WFC    45.0        12   540.0
# 4     GS   380.0         5  1900.0

# Agregar columna con valor constante
portafolio['moneda'] = 'USD'

# Agregar columna basada en condición
portafolio['categoria'] = portafolio['precio'].apply(
    lambda x: 'Alto' if x > 100 else 'Bajo'
)
\`\`\`

### Modificar Valores

\`\`\`python
# Modificar una celda
portafolio.loc[0, 'cantidad'] = 15

# Modificar una columna completa
portafolio['precio'] = portafolio['precio'] * 1.05

# Modificar basado en condición
portafolio.loc[portafolio['ticker'] == 'JPM', 'cantidad'] = 20
\`\`\`

### Eliminar Columnas y Filas

\`\`\`python
# Eliminar columna
portafolio_sin_sector = portafolio.drop('sector', axis=1)
# axis=1 indica columnas, axis=0 indica filas

# Eliminar múltiples columnas
portafolio_simple = portafolio.drop(['sector', 'nombre'], axis=1)

# Eliminar fila por índice
portafolio_sin_primera = portafolio.drop(0, axis=0)

# Eliminar in-place (modifica el DataFrame original)
portafolio.drop('moneda', axis=1, inplace=True)
\`\`\`

## Ejemplo Completo: Análisis de Portafolio

\`\`\`python
import pandas as pd

# Crear DataFrame con datos de portafolio
portafolio = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'nombre': ['JPMorgan Chase', 'Bank of America', 'Citigroup', 'Wells Fargo'],
    'precio_compra': [140.0, 30.0, 45.0, 40.0],
    'precio_actual': [150.0, 35.0, 50.0, 45.0],
    'cantidad': [10, 20, 15, 12]
})

print("=== Portafolio de Acciones Bancarias ===\n")
print(portafolio)

# Calcular valores
portafolio['inversion'] = portafolio['precio_compra'] * portafolio['cantidad']
portafolio['valor_actual'] = portafolio['precio_actual'] * portafolio['cantidad']
portafolio['ganancia'] = portafolio['valor_actual'] - portafolio['inversion']
portafolio['rendimiento_%'] = (portafolio['ganancia'] / portafolio['inversion']) * 100

# Mostrar análisis
print("\n=== Análisis de Rendimiento ===\n")
print(portafolio[['ticker', 'inversion', 'valor_actual', 'ganancia', 'rendimiento_%']])

# Estadísticas generales
print(f"\n=== Resumen ===")
print(f"Inversión total: ${portafolio['inversion'].sum():,.2f}")
print(f"Valor actual: ${portafolio['valor_actual'].sum():,.2f}")
print(f"Ganancia total: ${portafolio['ganancia'].sum():,.2f}")
print(f"Rendimiento promedio: {portafolio['rendimiento_%'].mean():.2f}%")

# Mejor y peor inversión
mejor_idx = portafolio['rendimiento_%'].idxmax()
peor_idx = portafolio['rendimiento_%'].idxmin()

print(f"\nMejor inversión: {portafolio.loc[mejor_idx, 'ticker']} "
      f"({portafolio.loc[mejor_idx, 'rendimiento_%']:.2f}%)")
print(f"Peor inversión: {portafolio.loc[peor_idx, 'ticker']} "
      f"({portafolio.loc[peor_idx, 'rendimiento_%']:.2f}%)")
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ La diferencia entre Series (1D) y DataFrame (2D)  
✓ Cómo crear DataFrames desde diccionarios y listas  
✓ Acceso a datos con \`[]\`, \`.loc[]\` y \`.iloc[]\`  
✓ Cómo agregar, modificar y eliminar columnas  
✓ Operaciones básicas y estadísticas con DataFrames  

## Puntos Clave

- **Pandas** es la biblioteca fundamental para análisis de datos en Python
- **Series**: Array unidimensional con índices (como una columna)
- **DataFrame**: Tabla bidimensional con filas y columnas etiquetadas
- Usa \`pd.DataFrame()\` para crear DataFrames desde diccionarios o listas
- **loc[]**: Acceso por etiquetas de índice
- **iloc[]**: Acceso por posición numérica
- Puedes agregar columnas simplemente asignando: \`df['nueva'] = valores\`
- Usa \`.head()\`, \`.tail()\`, \`.info()\` y \`.describe()\` para explorar datos
- Las operaciones aritméticas se aplican a todas las filas automáticamente
`
  }
];

  {
    id: '3-2',
    moduleId: '3',
    title: 'Lectura y Escritura de Datos',
    orderIndex: 2,
    content: `# Lectura y Escritura de Datos con Pandas

## ¿Qué aprenderás?

- Leer datos desde archivos CSV
- Escribir DataFrames a archivos CSV
- Manejar diferentes formatos y opciones de lectura
- Trabajar con datos financieros reales
- Limpiar y preparar datos importados

## ¿Qué construirás?

Importarás datos históricos de acciones bancarias desde archivos CSV, los analizarás y exportarás los resultados.

**Nivel de dificultad:** Principiante

---

## Lectura de Archivos CSV

CSV (Comma-Separated Values) es el formato más común para datos tabulares. Pandas hace que leer CSVs sea extremadamente fácil.

### Lectura Básica

\`\`\`python
import pandas as pd

# Leer archivo CSV
df = pd.read_csv('precios_acciones.csv')

# Ver las primeras filas
print(df.head())

# Información del DataFrame
print(df.info())
\`\`\`

### Opciones Comunes de read_csv()

\`\`\`python
# Especificar columna como índice
df = pd.read_csv('precios.csv', index_col='fecha')

# Especificar separador (por defecto es coma)
df = pd.read_csv('datos.txt', sep='\t')  # Tab-separated

# Leer solo ciertas columnas
df = pd.read_csv('precios.csv', usecols=['ticker', 'precio', 'volumen'])

# Saltar filas
df = pd.read_csv('precios.csv', skiprows=2)  # Saltar primeras 2 filas

# Leer solo N filas
df = pd.read_csv('precios.csv', nrows=100)  # Solo primeras 100 filas

# Especificar tipos de datos
df = pd.read_csv('precios.csv', dtype={'ticker': str, 'precio': float})

# Manejar valores faltantes
df = pd.read_csv('precios.csv', na_values=['N/A', 'missing', '-'])
\`\`\`

### Parsear Fechas

\`\`\`python
# Parsear columna de fecha automáticamente
df = pd.read_csv('precios.csv', parse_dates=['fecha'])

# Usar fecha como índice
df = pd.read_csv('precios.csv', 
                 index_col='fecha',
                 parse_dates=True)

print(df.index)  # DatetimeIndex
print(df.head())
\`\`\`

## Ejemplo: Leer Datos de Acciones

\`\`\`python
import pandas as pd

# Supongamos que tenemos un CSV con este formato:
# fecha,ticker,precio,volumen
# 2024-01-01,JPM,150.0,1000000
# 2024-01-01,BAC,35.0,2000000
# ...

# Leer datos
df = pd.read_csv('datos_acciones.csv', 
                 parse_dates=['fecha'],
                 index_col='fecha')

print("=== Datos de Acciones ===")
print(df.head())
print(f"\nTotal de registros: {len(df)}")
print(f"Rango de fechas: {df.index.min()} a {df.index.max()}")
print(f"Acciones únicas: {df['ticker'].unique()}")

# Filtrar por ticker
datos_jpm = df[df['ticker'] == 'JPM']
print(f"\nRegistros de JPM: {len(datos_jpm)}")
print(datos_jpm.head())
\`\`\`

## Crear DataFrame de Ejemplo

Para practicar sin archivos externos, podemos crear datos de ejemplo:

\`\`\`python
import pandas as pd
from datetime import datetime, timedelta

# Crear datos de ejemplo
fechas = [datetime(2024, 1, 1) + timedelta(days=i) for i in range(5)]
datos = {
    'fecha': fechas * 4,  # 5 días × 4 acciones = 20 filas
    'ticker': ['JPM'] * 5 + ['BAC'] * 5 + ['C'] * 5 + ['WFC'] * 5,
    'precio': [150, 152, 151, 155, 157,  # JPM
               35, 36, 35.5, 37, 36,      # BAC
               50, 51, 50.5, 52, 53,      # C
               45, 46, 45.5, 47, 48],     # WFC
    'volumen': [1000000, 1100000, 950000, 1200000, 1050000] * 4
}

df = pd.DataFrame(datos)
df['fecha'] = pd.to_datetime(df['fecha'])
df = df.set_index('fecha')

print(df.head(10))
\`\`\`

## Escritura de Archivos CSV

### Guardar DataFrame como CSV

\`\`\`python
# Guardar DataFrame
df.to_csv('resultados.csv')

# Sin incluir el índice
df.to_csv('resultados.csv', index=False)

# Especificar separador
df.to_csv('resultados.txt', sep='\t')

# Guardar solo ciertas columnas
df.to_csv('precios_simple.csv', columns=['ticker', 'precio'])

# Especificar formato de números
df.to_csv('resultados.csv', float_format='%.2f')

# Agregar a archivo existente
df.to_csv('resultados.csv', mode='a', header=False)
\`\`\`

## Ejemplo Completo: Pipeline de Datos

\`\`\`python
import pandas as pd
from datetime import datetime, timedelta

# 1. CREAR DATOS DE EJEMPLO
print("=== 1. Creando datos de ejemplo ===")
fechas = [datetime(2024, 1, 1) + timedelta(days=i) for i in range(10)]
datos = []

for fecha in fechas:
    datos.append({'fecha': fecha, 'ticker': 'JPM', 'precio': 150 + (fecha.day % 5)})
    datos.append({'fecha': fecha, 'ticker': 'BAC', 'precio': 35 + (fecha.day % 3)})
    datos.append({'fecha': fecha, 'ticker': 'C', 'precio': 50 + (fecha.day % 4)})

df_original = pd.DataFrame(datos)
print(f"Datos creados: {len(df_original)} registros")
print(df_original.head())

# 2. GUARDAR A CSV
print("\n=== 2. Guardando a CSV ===")
df_original.to_csv('datos_acciones_temp.csv', index=False)
print("✓ Archivo guardado: datos_acciones_temp.csv")

# 3. LEER DESDE CSV
print("\n=== 3. Leyendo desde CSV ===")
df_leido = pd.read_csv('datos_acciones_temp.csv', parse_dates=['fecha'])
print(f"Datos leídos: {len(df_leido)} registros")
print(df_leido.head())

# 4. PROCESAR DATOS
print("\n=== 4. Procesando datos ===")
# Calcular precio promedio por ticker
promedios = df_leido.groupby('ticker')['precio'].mean()
print("\nPrecios promedio:")
print(promedios)

# Crear DataFrame de resultados
resultados = pd.DataFrame({
    'ticker': promedios.index,
    'precio_promedio': promedios.values,
    'fecha_analisis': datetime.now()
})

# 5. GUARDAR RESULTADOS
print("\n=== 5. Guardando resultados ===")
resultados.to_csv('analisis_resultados.csv', index=False, float_format='%.2f')
print("✓ Resultados guardados: analisis_resultados.csv")
print(resultados)
\`\`\`

## Trabajar con Datos de yfinance

Aunque yfinance descarga datos directamente, es común guardarlos en CSV para uso posterior:

\`\`\`python
import pandas as pd
# import yfinance as yf  # Descomentar si tienes yfinance instalado

# Descargar datos (ejemplo conceptual)
# ticker = yf.Ticker("JPM")
# df = ticker.history(period="1mo")

# Simular datos de yfinance
df = pd.DataFrame({
    'Open': [150, 152, 151, 155],
    'High': [153, 155, 154, 158],
    'Low': [149, 151, 150, 154],
    'Close': [152, 154, 153, 157],
    'Volume': [1000000, 1100000, 950000, 1200000]
}, index=pd.date_range('2024-01-01', periods=4))

# Guardar datos históricos
df.to_csv('JPM_historico.csv')
print("✓ Datos históricos guardados")

# Leer datos guardados
df_historico = pd.read_csv('JPM_historico.csv', 
                           index_col=0, 
                           parse_dates=True)

print("\n=== Datos Históricos de JPM ===")
print(df_historico)

# Calcular rendimientos diarios
df_historico['Rendimiento'] = df_historico['Close'].pct_change() * 100

# Guardar con rendimientos
df_historico.to_csv('JPM_con_rendimientos.csv', float_format='%.2f')
print("\n✓ Datos con rendimientos guardados")
\`\`\`

## Manejo de Errores al Leer Archivos

\`\`\`python
import pandas as pd
import os

def leer_datos_seguros(archivo):
    """Lee un archivo CSV con manejo de errores."""
    try:
        # Verificar si el archivo existe
        if not os.path.exists(archivo):
            print(f"❌ Error: El archivo '{archivo}' no existe")
            return None
        
        # Intentar leer el archivo
        df = pd.read_csv(archivo)
        print(f"✓ Archivo leído exitosamente: {len(df)} filas")
        return df
        
    except pd.errors.EmptyDataError:
        print(f"❌ Error: El archivo '{archivo}' está vacío")
        return None
        
    except pd.errors.ParserError:
        print(f"❌ Error: No se pudo parsear el archivo '{archivo}'")
        return None
        
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        return None

# Usar la función
df = leer_datos_seguros('datos.csv')
if df is not None:
    print(df.head())
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Cómo leer archivos CSV con \`pd.read_csv()\`  
✓ Opciones importantes: index_col, parse_dates, usecols  
✓ Cómo guardar DataFrames con \`.to_csv()\`  
✓ Manejo de fechas en archivos CSV  
✓ Buenas prácticas para leer y escribir datos  

## Puntos Clave

- **pd.read_csv()**: Función principal para leer archivos CSV
- Usa **parse_dates** para convertir columnas de texto a fechas
- Usa **index_col** para especificar qué columna usar como índice
- **.to_csv()**: Guarda DataFrames como archivos CSV
- Usa **index=False** si no quieres guardar el índice
- Siempre maneja errores al leer archivos externos
- Guarda datos procesados para evitar recalcular
- CSV es ideal para compartir datos entre programas
- Pandas puede leer muchos otros formatos: Excel, JSON, SQL, etc.
`
  }
];

  {
    id: '3-3',
    moduleId: '3',
    title: 'Filtrado y Selección',
    orderIndex: 3,
    content: `# Filtrado y Selección de Datos

## ¿Qué aprenderás?

- Filtrar DataFrames con condiciones booleanas
- Combinar múltiples condiciones de filtrado
- Ordenar datos por una o más columnas
- Seleccionar subconjuntos específicos de datos
- Aplicar filtros complejos en análisis financiero

## ¿Qué construirás?

Crearás un sistema de filtrado avanzado para identificar oportunidades de inversión basadas en múltiples criterios financieros.

**Nivel de dificultad:** Intermedio

---

## Filtrado con Condiciones Booleanas

El filtrado es una de las operaciones más importantes en análisis de datos. Pandas permite filtrar filas basándose en condiciones.

### Filtrado Básico

\`\`\`python
import pandas as pd

# Crear DataFrame de ejemplo
acciones = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0],
    'pe_ratio': [10.5, 9.8, 8.2, 11.2, 15.5],
    'dividendo': [3.2, 2.8, 4.1, 3.5, 2.0],
    'volumen': [1000000, 2000000, 1500000, 1200000, 800000]
})

print("=== Datos Originales ===")
print(acciones)

# Filtrar acciones con precio > 50
acciones_caras = acciones[acciones['precio'] > 50]
print("\n=== Acciones con precio > $50 ===")
print(acciones_caras)

# Filtrar por P/E ratio bajo
bajo_pe = acciones[acciones['pe_ratio'] < 10]
print("\n=== Acciones con P/E < 10 ===")
print(bajo_pe)

# Filtrar por ticker específico
jpm_data = acciones[acciones['ticker'] == 'JPM']
print("\n=== Datos de JPM ===")
print(jpm_data)
\`\`\`

### Cómo Funciona el Filtrado

\`\`\`python
# El filtrado crea una máscara booleana
mascara = acciones['precio'] > 50
print("=== Máscara Booleana ===")
print(mascara)
# 0     True   (JPM: 150.0 > 50)
# 1    False   (BAC: 35.0 > 50)
# 2    False   (C: 50.0 > 50)
# 3    False   (WFC: 45.0 > 50)
# 4     True   (GS: 380.0 > 50)
# Name: precio, dtype: bool

# Aplicar la máscara al DataFrame
resultado = acciones[mascara]
print("\n=== Resultado del Filtrado ===")
print(resultado)
\`\`\`

## Múltiples Condiciones

### Operadores Lógicos

\`\`\`python
# AND: ambas condiciones deben ser True
# Sintaxis: (condicion1) & (condicion2)
buenas_opciones = acciones[
    (acciones['precio'] < 100) & 
    (acciones['dividendo'] > 3.0)
]
print("=== Precio < $100 Y Dividendo > 3% ===")
print(buenas_opciones)

# OR: al menos una condición debe ser True
# Sintaxis: (condicion1) | (condicion2)
extremos = acciones[
    (acciones['precio'] < 40) | 
    (acciones['precio'] > 300)
]
print("\n=== Precio < $40 O Precio > $300 ===")
print(extremos)

# NOT: invierte la condición
# Sintaxis: ~condicion
no_caras = acciones[~(acciones['precio'] > 100)]
print("\n=== Acciones NO caras (precio <= $100) ===")
print(no_caras)
\`\`\`

### Filtros Complejos

\`\`\`python
# Combinar múltiples condiciones
# Criterio: precio < $100 Y (dividendo > 3% O pe_ratio < 10)
oportunidades = acciones[
    (acciones['precio'] < 100) &
    ((acciones['dividendo'] > 3.0) | (acciones['pe_ratio'] < 10))
]
print("=== Oportunidades de Inversión ===")
print(oportunidades)

# Filtrar por lista de valores
bancos_grandes = ['JPM', 'BAC', 'C']
grandes = acciones[acciones['ticker'].isin(bancos_grandes)]
print("\n=== Bancos Grandes ===")
print(grandes)

# Excluir valores de una lista
sin_gs = acciones[~acciones['ticker'].isin(['GS'])]
print("\n=== Sin Goldman Sachs ===")
print(sin_gs)
\`\`\`

## Métodos de Filtrado

### between(): Filtrar Rangos

\`\`\`python
# Filtrar precios en un rango
rango_medio = acciones[acciones['precio'].between(40, 200)]
print("=== Precios entre $40 y $200 ===")
print(rango_medio)

# Equivalente a:
# acciones[(acciones['precio'] >= 40) & (acciones['precio'] <= 200)]
\`\`\`

### query(): Filtrado con Strings

\`\`\`python
# Sintaxis más legible para filtros complejos
resultado = acciones.query('precio < 100 and dividendo > 3.0')
print("=== Usando query() ===")
print(resultado)

# Con variables externas
precio_max = 100
resultado = acciones.query('precio < @precio_max')
print("\n=== query() con variable externa ===")
print(resultado)
\`\`\`

## Ordenamiento de Datos

### sort_values(): Ordenar por Columna

\`\`\`python
# Ordenar por precio (ascendente)
por_precio = acciones.sort_values('precio')
print("=== Ordenado por Precio (menor a mayor) ===")
print(por_precio)

# Ordenar descendente
por_precio_desc = acciones.sort_values('precio', ascending=False)
print("\n=== Ordenado por Precio (mayor a menor) ===")
print(por_precio_desc)

# Ordenar por múltiples columnas
ordenado = acciones.sort_values(['dividendo', 'precio'], 
                                ascending=[False, True])
print("\n=== Ordenado por Dividendo (desc) y Precio (asc) ===")
print(ordenado)
\`\`\`

### sort_index(): Ordenar por Índice

\`\`\`python
# Crear DataFrame con índice desordenado
df = acciones.set_index('ticker')
df = df.loc[['GS', 'BAC', 'JPM', 'C', 'WFC']]

print("=== Índice Desordenado ===")
print(df)

# Ordenar por índice
df_ordenado = df.sort_index()
print("\n=== Índice Ordenado ===")
print(df_ordenado)
\`\`\`

## Selección Avanzada

### nlargest() y nsmallest()

\`\`\`python
# Top 3 acciones más caras
top_3_caras = acciones.nlargest(3, 'precio')
print("=== Top 3 Más Caras ===")
print(top_3_caras)

# Top 3 con mejor dividendo
top_3_dividendo = acciones.nlargest(3, 'dividendo')
print("\n=== Top 3 Mejor Dividendo ===")
print(top_3_dividendo)

# 2 acciones más baratas
mas_baratas = acciones.nsmallest(2, 'precio')
print("\n=== 2 Más Baratas ===")
print(mas_baratas)
\`\`\`

### sample(): Selección Aleatoria

\`\`\`python
# Seleccionar 3 acciones al azar
muestra = acciones.sample(n=3)
print("=== Muestra Aleatoria (3 acciones) ===")
print(muestra)

# Seleccionar 50% de las filas
muestra_porcentaje = acciones.sample(frac=0.5)
print("\n=== Muestra Aleatoria (50%) ===")
print(muestra_porcentaje)
\`\`\`

## Ejemplo Completo: Sistema de Screening

\`\`\`python
import pandas as pd

# Datos de acciones bancarias
acciones = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS', 'MS', 'USB', 'PNC'],
    'nombre': ['JPMorgan', 'Bank of America', 'Citigroup', 'Wells Fargo',
               'Goldman Sachs', 'Morgan Stanley', 'US Bancorp', 'PNC Financial'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0, 90.0, 42.0, 155.0],
    'pe_ratio': [10.5, 9.8, 8.2, 11.2, 15.5, 12.0, 10.0, 11.5],
    'dividendo': [3.2, 2.8, 4.1, 3.5, 2.0, 3.8, 3.6, 3.3],
    'volumen': [1000000, 2000000, 1500000, 1200000, 800000, 900000, 700000, 600000],
    'cap_mercado': [450, 280, 100, 170, 120, 150, 65, 70]  # en miles de millones
})

print("=== Sistema de Screening de Acciones ===\n")

# CRITERIO 1: Value Investing
print("1. VALUE INVESTING (P/E < 11 y Dividendo > 3%)")
value_stocks = acciones[
    (acciones['pe_ratio'] < 11) &
    (acciones['dividendo'] > 3.0)
]
print(value_stocks[['ticker', 'precio', 'pe_ratio', 'dividendo']])
print(f"Encontradas: {len(value_stocks)} acciones\n")

# CRITERIO 2: Alta Liquidez
print("2. ALTA LIQUIDEZ (Volumen > 1M y Cap > $100B)")
liquidas = acciones[
    (acciones['volumen'] > 1000000) &
    (acciones['cap_mercado'] > 100)
]
print(liquidas[['ticker', 'volumen', 'cap_mercado']])
print(f"Encontradas: {len(liquidas)} acciones\n")

# CRITERIO 3: Precio Accesible
print("3. PRECIO ACCESIBLE ($30 - $100)")
accesibles = acciones[acciones['precio'].between(30, 100)]
print(accesibles[['ticker', 'precio']].sort_values('precio'))
print(f"Encontradas: {len(accesibles)} acciones\n")

# CRITERIO 4: Mejor Combinación (Score Compuesto)
print("4. MEJOR COMBINACIÓN (Score Compuesto)")
# Normalizar métricas (invertir P/E porque menor es mejor)
acciones['score_pe'] = 1 / acciones['pe_ratio']
acciones['score_div'] = acciones['dividendo']
acciones['score_total'] = acciones['score_pe'] + acciones['score_div']

mejores = acciones.nlargest(5, 'score_total')
print(mejores[['ticker', 'precio', 'pe_ratio', 'dividendo', 'score_total']])
print(f"\nTop 5 por score compuesto\n")

# RESUMEN: Recomendaciones Finales
print("=== RECOMENDACIONES FINALES ===")
# Acciones que cumplen al menos 2 criterios
recomendadas = set()

for ticker in acciones['ticker']:
    criterios_cumplidos = 0
    accion = acciones[acciones['ticker'] == ticker].iloc[0]
    
    # Verificar cada criterio
    if accion['pe_ratio'] < 11 and accion['dividendo'] > 3.0:
        criterios_cumplidos += 1
    if accion['volumen'] > 1000000 and accion['cap_mercado'] > 100:
        criterios_cumplidos += 1
    if 30 <= accion['precio'] <= 100:
        criterios_cumplidos += 1
    
    if criterios_cumplidos >= 2:
        recomendadas.add(ticker)

resultado_final = acciones[acciones['ticker'].isin(recomendadas)]
resultado_final = resultado_final.sort_values('score_total', ascending=False)

print(resultado_final[['ticker', 'nombre', 'precio', 'pe_ratio', 'dividendo']])
print(f"\n✓ {len(resultado_final)} acciones recomendadas")
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Cómo filtrar con condiciones booleanas  
✓ Combinar condiciones con &, |, ~  
✓ Usar .isin() para filtrar por lista de valores  
✓ Ordenar con .sort_values() y .sort_index()  
✓ Seleccionar top N con .nlargest() y .nsmallest()  

## Puntos Clave

- **Filtrado**: Usa condiciones booleanas entre corchetes \`df[condicion]\`
- **Múltiples condiciones**: Usa & (AND), | (OR), ~ (NOT)
- Siempre usa **paréntesis** alrededor de cada condición
- **.isin()**: Filtra por lista de valores
- **.between()**: Filtra rangos de valores
- **.query()**: Sintaxis alternativa más legible
- **.sort_values()**: Ordena por columnas
- **.nlargest()** / **.nsmallest()**: Selecciona top N valores
- El filtrado no modifica el DataFrame original (crea una copia)
`
  }
];

  {
    id: '3-4',
    moduleId: '3',
    title: 'Operaciones Básicas',
    orderIndex: 4,
    content: `# Operaciones Básicas con Pandas

## ¿Qué aprenderás?

- Realizar operaciones aritméticas con DataFrames
- Usar groupby para agregaciones
- Combinar DataFrames con merge y join
- Manejar valores faltantes (NaN)
- Aplicar funciones a filas y columnas

## ¿Qué construirás?

Crearás un sistema de análisis que combina datos de múltiples fuentes, calcula métricas agregadas y maneja datos incompletos.

**Nivel de dificultad:** Intermedio

---

## Operaciones Aritméticas

Pandas permite realizar operaciones matemáticas de forma vectorizada (aplicadas a todas las filas automáticamente).

### Operaciones con Columnas

\`\`\`python
import pandas as pd

# Crear DataFrame de portafolio
portafolio = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio_compra': [140.0, 30.0, 45.0, 40.0],
    'precio_actual': [150.0, 35.0, 50.0, 45.0],
    'cantidad': [10, 20, 15, 12]
})

# Operaciones aritméticas básicas
portafolio['inversion'] = portafolio['precio_compra'] * portafolio['cantidad']
portafolio['valor_actual'] = portafolio['precio_actual'] * portafolio['cantidad']
portafolio['ganancia'] = portafolio['valor_actual'] - portafolio['inversion']
portafolio['rendimiento_%'] = (portafolio['ganancia'] / portafolio['inversion']) * 100

print(portafolio)
\`\`\`

### Operaciones entre DataFrames

\`\`\`python
# Precios en dos momentos diferentes
precios_ayer = pd.Series([150, 35, 50, 45], index=['JPM', 'BAC', 'C', 'WFC'])
precios_hoy = pd.Series([152, 36, 49, 46], index=['JPM', 'BAC', 'C', 'WFC'])

# Calcular cambio
cambio = precios_hoy - precios_ayer
cambio_porcentual = ((precios_hoy - precios_ayer) / precios_ayer) * 100

print("=== Cambio de Precios ===")
print(f"Cambio absoluto:\n{cambio}\n")
print(f"Cambio porcentual:\n{cambio_porcentual}")
\`\`\`

## GroupBy: Agregaciones por Grupo

GroupBy es una de las operaciones más poderosas de Pandas. Permite agrupar datos y calcular estadísticas por grupo.

### GroupBy Básico

\`\`\`python
# Datos de transacciones
transacciones = pd.DataFrame({
    'fecha': ['2024-01-01', '2024-01-01', '2024-01-02', '2024-01-02', '2024-01-03'],
    'ticker': ['JPM', 'BAC', 'JPM', 'BAC', 'JPM'],
    'tipo': ['compra', 'compra', 'venta', 'compra', 'compra'],
    'cantidad': [10, 20, 5, 15, 8],
    'precio': [150, 35, 152, 36, 151]
})

# Agrupar por ticker y calcular suma
por_ticker = transacciones.groupby('ticker')['cantidad'].sum()
print("=== Cantidad Total por Ticker ===")
print(por_ticker)
# ticker
# BAC    35
# JPM    23
# Name: cantidad, dtype: int64

# Múltiples agregaciones
estadisticas = transacciones.groupby('ticker').agg({
    'cantidad': 'sum',
    'precio': ['mean', 'min', 'max']
})
print("\n=== Estadísticas por Ticker ===")
print(estadisticas)
\`\`\`

### Múltiples Columnas de Agrupación

\`\`\`python
# Agrupar por ticker Y tipo de transacción
por_ticker_tipo = transacciones.groupby(['ticker', 'tipo'])['cantidad'].sum()
print("=== Cantidad por Ticker y Tipo ===")
print(por_ticker_tipo)
# ticker  tipo   
# BAC     compra    35
# JPM     compra    18
#         venta      5
# Name: cantidad, dtype: int64

# Convertir a DataFrame con reset_index()
df_agrupado = transacciones.groupby(['ticker', 'tipo'])['cantidad'].sum().reset_index()
print("\n=== Como DataFrame ===")
print(df_agrupado)
\`\`\`

### Funciones de Agregación Comunes

\`\`\`python
# Datos de precios diarios
precios_diarios = pd.DataFrame({
    'ticker': ['JPM']*5 + ['BAC']*5,
    'fecha': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'] * 2,
    'precio': [150, 152, 151, 155, 157, 35, 36, 35.5, 37, 36]
})

# Múltiples estadísticas
resumen = precios_diarios.groupby('ticker')['precio'].agg([
    'count',   # Cantidad de registros
    'mean',    # Promedio
    'std',     # Desviación estándar
    'min',     # Mínimo
    'max',     # Máximo
    'sum'      # Suma
])

print("=== Resumen Estadístico por Ticker ===")
print(resumen)
\`\`\`

## Merge y Join: Combinar DataFrames

### Merge: Unir por Columnas Comunes

\`\`\`python
# DataFrame 1: Información básica
info_basica = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'nombre': ['JPMorgan', 'Bank of America', 'Citigroup'],
    'sector': ['Banca', 'Banca', 'Banca']
})

# DataFrame 2: Precios
precios = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'WFC'],
    'precio': [150.0, 35.0, 45.0],
    'volumen': [1000000, 2000000, 1200000]
})

# Inner join (solo coincidencias)
inner = pd.merge(info_basica, precios, on='ticker', how='inner')
print("=== Inner Join ===")
print(inner)
#   ticker            nombre sector  precio   volumen
# 0    JPM          JPMorgan  Banca   150.0   1000000
# 1    BAC  Bank of America  Banca    35.0   2000000

# Left join (todas las filas de la izquierda)
left = pd.merge(info_basica, precios, on='ticker', how='left')
print("\n=== Left Join ===")
print(left)
#   ticker            nombre sector  precio   volumen
# 0    JPM          JPMorgan  Banca   150.0   1000000.0
# 1    BAC  Bank of America  Banca    35.0   2000000.0
# 2      C         Citigroup  Banca     NaN         NaN

# Outer join (todas las filas de ambos)
outer = pd.merge(info_basica, precios, on='ticker', how='outer')
print("\n=== Outer Join ===")
print(outer)
\`\`\`

### Join con Índices

\`\`\`python
# DataFrames con índices
df1 = pd.DataFrame({'precio': [150, 35, 50]}, 
                   index=['JPM', 'BAC', 'C'])
df2 = pd.DataFrame({'dividendo': [3.2, 2.8, 3.5]}, 
                   index=['JPM', 'BAC', 'WFC'])

# Join por índice
resultado = df1.join(df2, how='outer')
print("=== Join por Índice ===")
print(resultado)
#      precio  dividendo
# BAC    35.0        2.8
# C      50.0        NaN
# JPM   150.0        3.2
# WFC     NaN        3.5
\`\`\`

## Manejo de Valores Faltantes (NaN)

### Detectar Valores Faltantes

\`\`\`python
# DataFrame con valores faltantes
datos = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, None, 50.0, 45.0],
    'dividendo': [3.2, 2.8, None, 3.5],
    'pe_ratio': [10.5, 9.8, 8.2, None]
})

print("=== Datos con Valores Faltantes ===")
print(datos)

# Detectar NaN
print("\n=== ¿Hay valores faltantes? ===")
print(datos.isnull())

# Contar valores faltantes por columna
print("\n=== Cantidad de NaN por columna ===")
print(datos.isnull().sum())

# Verificar si hay algún NaN
print(f"\n¿Hay algún NaN? {datos.isnull().any().any()}")
\`\`\`

### Eliminar Valores Faltantes

\`\`\`python
# Eliminar filas con cualquier NaN
sin_nan = datos.dropna()
print("=== Sin filas con NaN ===")
print(sin_nan)

# Eliminar filas donde una columna específica tiene NaN
sin_nan_precio = datos.dropna(subset=['precio'])
print("\n=== Sin NaN en precio ===")
print(sin_nan_precio)

# Eliminar columnas con NaN
sin_columnas_nan = datos.dropna(axis=1)
print("\n=== Sin columnas con NaN ===")
print(sin_columnas_nan)
\`\`\`

### Rellenar Valores Faltantes

\`\`\`python
# Rellenar con un valor específico
datos_rellenos = datos.fillna(0)
print("=== Rellenado con 0 ===")
print(datos_rellenos)

# Rellenar con el promedio de la columna
datos['precio'] = datos['precio'].fillna(datos['precio'].mean())
print("\n=== Precio rellenado con promedio ===")
print(datos)

# Rellenar con el valor anterior (forward fill)
datos_ffill = datos.fillna(method='ffill')

# Rellenar con el valor siguiente (backward fill)
datos_bfill = datos.fillna(method='bfill')

# Rellenar con valores diferentes por columna
datos_custom = datos.fillna({
    'precio': datos['precio'].mean(),
    'dividendo': 0,
    'pe_ratio': datos['pe_ratio'].median()
})
\`\`\`

## Apply: Aplicar Funciones

### Apply a Columnas

\`\`\`python
portafolio = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0]
})

# Aplicar función a una columna
def clasificar_precio(precio):
    if precio > 100:
        return 'Alto'
    elif precio > 50:
        return 'Medio'
    else:
        return 'Bajo'

portafolio['categoria'] = portafolio['precio'].apply(clasificar_precio)
print(portafolio)

# Con lambda
portafolio['precio_redondeado'] = portafolio['precio'].apply(lambda x: round(x, -1))
print(portafolio)
\`\`\`

### Apply a Filas

\`\`\`python
portafolio = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15]
})

# Aplicar función a cada fila
def calcular_valor(fila):
    return fila['precio'] * fila['cantidad']

portafolio['valor'] = portafolio.apply(calcular_valor, axis=1)
print(portafolio)

# Con lambda y múltiples columnas
portafolio['descripcion'] = portafolio.apply(
    lambda row: f"{row['ticker']}: {row['cantidad']} acciones @ ${row['precio']}",
    axis=1
)
print(portafolio)
\`\`\`

## Ejemplo Completo: Análisis Integrado

\`\`\`python
import pandas as pd

# 1. DATOS DE MÚLTIPLES FUENTES
print("=== 1. Cargando Datos ===")

# Precios históricos
precios_hist = pd.DataFrame({
    'ticker': ['JPM']*3 + ['BAC']*3 + ['C']*3,
    'fecha': ['2024-01-01', '2024-01-02', '2024-01-03'] * 3,
    'precio': [150, 152, 151, 35, 36, 35.5, 50, 51, None]
})

# Información fundamental
fundamentales = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'pe_ratio': [10.5, 9.8, 8.2, 11.2],
    'dividendo': [3.2, 2.8, 4.1, 3.5]
})

# Portafolio actual
portafolio = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'cantidad': [10, 20, 15]
})

# 2. LIMPIAR DATOS
print("\n=== 2. Limpiando Datos ===")
print(f"NaN en precios: {precios_hist['precio'].isnull().sum()}")

# Rellenar NaN con el último precio conocido
precios_hist['precio'] = precios_hist.groupby('ticker')['precio'].fillna(method='ffill')
print(f"Después de limpiar: {precios_hist['precio'].isnull().sum()}")

# 3. CALCULAR MÉTRICAS
print("\n=== 3. Calculando Métricas ===")

# Precio promedio por ticker
precio_promedio = precios_hist.groupby('ticker')['precio'].mean().reset_index()
precio_promedio.columns = ['ticker', 'precio_promedio']
print(precio_promedio)

# 4. COMBINAR DATOS
print("\n=== 4. Combinando Datos ===")

# Combinar portafolio con precios
analisis = pd.merge(portafolio, precio_promedio, on='ticker')
analisis = pd.merge(analisis, fundamentales, on='ticker', how='left')

print(analisis)

# 5. ANÁLISIS FINAL
print("\n=== 5. Análisis Final ===")

# Calcular valor de posiciones
analisis['valor_posicion'] = analisis['precio_promedio'] * analisis['cantidad']

# Calcular score de inversión
analisis['score'] = (1 / analisis['pe_ratio']) + analisis['dividendo']

# Ordenar por score
analisis = analisis.sort_values('score', ascending=False)

print("\n=== Portafolio Analizado ===")
print(analisis[['ticker', 'cantidad', 'precio_promedio', 'valor_posicion', 
                'pe_ratio', 'dividendo', 'score']])

# Resumen
print(f"\n=== Resumen ===")
print(f"Valor total del portafolio: ${analisis['valor_posicion'].sum():,.2f}")
print(f"P/E promedio: {analisis['pe_ratio'].mean():.2f}")
print(f"Dividendo promedio: {analisis['dividendo'].mean():.2f}%")
print(f"Mejor inversión: {analisis.iloc[0]['ticker']} (score: {analisis.iloc[0]['score']:.2f})")
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Operaciones aritméticas con columnas de DataFrames  
✓ GroupBy para agregaciones por grupo  
✓ Merge y join para combinar DataFrames  
✓ Detectar y manejar valores faltantes (NaN)  
✓ Aplicar funciones con .apply()  

## Puntos Clave

- **Operaciones vectorizadas**: Se aplican a todas las filas automáticamente
- **GroupBy**: Agrupa datos y calcula estadísticas - \`df.groupby('columna').agg()\`
- **Merge**: Combina DataFrames por columnas comunes - tipos: inner, left, right, outer
- **Join**: Combina DataFrames por índices
- **NaN**: Usa .isnull(), .dropna(), .fillna() para manejar valores faltantes
- **.apply()**: Aplica funciones personalizadas a filas o columnas
- **axis=0**: Operación por columnas (vertical)
- **axis=1**: Operación por filas (horizontal)
- Siempre limpia y valida datos antes de análisis
- Combina múltiples operaciones para análisis complejos
`
  }
];
