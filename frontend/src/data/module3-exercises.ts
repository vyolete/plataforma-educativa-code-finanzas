// Module 3: Introducción a Pandas - Exercises
// 5-10 exercises per lesson, total ~30 exercises

import { Exercise } from './exercises';

export const module3Exercises: Exercise[] = [
  // ============================================
  // LESSON 3.1: DataFrames y Series
  // ============================================
  
  {
    id: 'ex-3-1-1',
    moduleId: 'module-3',
    lessonId: 'lesson-3-1',
    title: 'Crear una Series Simple',
    description: 'Crea una Series de Pandas con precios de acciones bancarias.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `import pandas as pd

# Crea una Series con estos precios
# JPM: 150.0, BAC: 35.0, C: 50.0, WFC: 45.0
precios = 

print(precios)`,
    solution: `import pandas as pd

precios = pd.Series([150.0, 35.0, 50.0, 45.0], 
                    index=['JPM', 'BAC', 'C', 'WFC'])

print(precios)`,
    hints: [
      'Usa pd.Series() con una lista de valores',
      'Especifica el parámetro index con los tickers',
      'Los índices deben ser una lista de strings'
    ],
    testCases: [
      {
        expectedOutput: 'JPM    150.0\nBAC     35.0\nC       50.0\nWFC     45.0',
        description: 'Debe crear la Series con los índices correctos'
      }
    ],
    tags: ['pandas', 'series', 'basico']
  },

  {
    id: 'ex-3-1-2',
    moduleId: 'module-3',
    lessonId: 'lesson-3-1',
    title: 'Acceder a Elementos de Series',
    description: 'Accede al precio de JPM y al último elemento de la Series.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `import pandas as pd

precios = pd.Series([150.0, 35.0, 50.0, 45.0], 
                    index=['JPM', 'BAC', 'C', 'WFC'])

# Accede al precio de JPM
precio_jpm = 

# Accede al último elemento
ultimo = 

print(f"JPM: {precio_jpm}, Último: {ultimo}")`,
    solution: `import pandas as pd

precios = pd.Series([150.0, 35.0, 50.0, 45.0], 
                    index=['JPM', 'BAC', 'C', 'WFC'])

precio_jpm = precios['JPM']
ultimo = precios[-1]

print(f"JPM: {precio_jpm}, Último: {ultimo}")`,
    hints: [
      'Usa corchetes con el nombre del índice para acceder por etiqueta',
      'Usa índice negativo -1 para el último elemento',
      'Similar a listas, pero con etiquetas'
    ],
    testCases: [
      {
        expectedOutput: 'JPM: 150.0, Último: 45.0',
        description: 'Debe acceder correctamente a los elementos'
      }
    ],
    tags: ['pandas', 'series', 'indexacion']
  },

  {
    id: 'ex-3-1-3',
    moduleId: 'module-3',
    lessonId: 'lesson-3-1',
    title: 'Crear DataFrame desde Diccionario',
    description: 'Crea un DataFrame con información de acciones bancarias.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd

# Crea un DataFrame con estas columnas:
# ticker: ['JPM', 'BAC', 'C']
# precio: [150.0, 35.0, 50.0]
# cantidad: [10, 20, 15]
df = 

print(df)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15]
})

print(df)`,
    hints: [
      'Usa pd.DataFrame() con un diccionario',
      'Cada clave del diccionario es una columna',
      'Los valores son listas con los datos de cada fila'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio  cantidad\n0    JPM   150.0        10\n1    BAC    35.0        20\n2      C    50.0        15',
        description: 'Debe crear el DataFrame correctamente'
      }
    ],
    tags: ['pandas', 'dataframe', 'creacion']
  },

  {
    id: 'ex-3-1-4',
    moduleId: 'module-3',
    lessonId: 'lesson-3-1',
    title: 'Acceder a Columnas',
    description: 'Accede a la columna de precios y calcula el promedio.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0]
})

# Accede a la columna precio
precios = 

# Calcula el promedio
promedio = 

print(f"Promedio: {promedio}")`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0]
})

precios = df['precio']
promedio = precios.mean()

print(f"Promedio: {promedio}")`,
    hints: [
      'Accede a una columna con df["nombre_columna"]',
      'Usa el método .mean() para calcular el promedio',
      'Las columnas son Series de Pandas'
    ],
    testCases: [
      {
        expectedOutput: 'Promedio: 70.0',
        description: 'Debe calcular el promedio correctamente'
      }
    ],
    tags: ['pandas', 'dataframe', 'columnas', 'estadisticas']
  },

  {
    id: 'ex-3-1-5',
    moduleId: 'module-3',
    lessonId: 'lesson-3-1',
    title: 'Agregar Nueva Columna',
    description: 'Agrega una columna "valor" calculando precio × cantidad.',
    difficulty: 'intermediate',
    xpReward: 25,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15]
})

# Agrega columna valor
df['valor'] = 

print(df)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15]
})

df['valor'] = df['precio'] * df['cantidad']

print(df)`,
    hints: [
      'Multiplica las columnas precio y cantidad',
      'Asigna el resultado a una nueva columna con df["valor"] =',
      'Las operaciones se aplican elemento por elemento'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio  cantidad    valor\n0    JPM   150.0        10  1500.0\n1    BAC    35.0        20   700.0\n2      C    50.0        15   750.0',
        description: 'Debe calcular el valor correctamente'
      }
    ],
    tags: ['pandas', 'dataframe', 'operaciones', 'columnas']
  },

  {
    id: 'ex-3-1-6',
    moduleId: 'module-3',
    lessonId: 'lesson-3-1',
    title: 'Usar loc para Acceder a Datos',
    description: 'Usa .loc[] para acceder a la primera fila y al precio de JPM.',
    difficulty: 'intermediate',
    xpReward: 25,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15]
})

# Accede a la primera fila
primera_fila = 

# Accede al precio de la fila 0
precio = 

print(f"Primera fila:\\n{primera_fila}")
print(f"\\nPrecio: {precio}")`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15]
})

primera_fila = df.loc[0]
precio = df.loc[0, 'precio']

print(f"Primera fila:\\n{primera_fila}")
print(f"\\nPrecio: {precio}")`,
    hints: [
      'Usa .loc[indice] para acceder a una fila',
      'Usa .loc[indice, "columna"] para una celda específica',
      '.loc[] usa etiquetas de índice'
    ],
    testCases: [
      {
        expectedOutput: 'Primera fila:\nticker      JPM\nprecio    150.0\ncantidad     10\nName: 0, dtype: object\n\nPrecio: 150.0',
        description: 'Debe acceder correctamente con .loc[]'
      }
    ],
    tags: ['pandas', 'dataframe', 'loc', 'indexacion']
  },

  {
    id: 'ex-3-1-7',
    moduleId: 'module-3',
    lessonId: 'lesson-3-1',
    title: 'Estadísticas Descriptivas',
    description: 'Usa .describe() para obtener estadísticas del DataFrame.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0],
    'cantidad': [10, 20, 15, 12]
})

# Obtén estadísticas descriptivas
estadisticas = 

print(estadisticas)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0],
    'cantidad': [10, 20, 15, 12]
})

estadisticas = df.describe()

print(estadisticas)`,
    hints: [
      'Usa el método .describe() del DataFrame',
      'No necesita parámetros',
      'Retorna estadísticas para columnas numéricas'
    ],
    testCases: [
      {
        expectedOutput: '          precio   cantidad\ncount   4.000000   4.000000\nmean   70.000000  14.250000',
        description: 'Debe mostrar estadísticas descriptivas'
      }
    ],
    tags: ['pandas', 'dataframe', 'estadisticas', 'describe']
  },

  // ============================================
  // LESSON 3.2: Lectura y Escritura de Datos
  // ============================================

  {
    id: 'ex-3-2-1',
    moduleId: 'module-3',
    lessonId: 'lesson-3-2',
    title: 'Crear DataFrame para Exportar',
    description: 'Crea un DataFrame con datos de acciones y guárdalo como CSV.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd

# Crea un DataFrame con datos de acciones
datos = {
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'volumen': [1000000, 2000000, 1500000]
}
df = 

# Guarda como CSV (sin índice)
# df.to_csv('acciones.csv', index=False)

print(df)`,
    solution: `import pandas as pd

datos = {
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'volumen': [1000000, 2000000, 1500000]
}
df = pd.DataFrame(datos)

# df.to_csv('acciones.csv', index=False)

print(df)`,
    hints: [
      'Usa pd.DataFrame() con el diccionario datos',
      'El método .to_csv() guarda el DataFrame',
      'index=False evita guardar el índice numérico'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio   volumen\n0    JPM   150.0   1000000\n1    BAC    35.0   2000000\n2      C    50.0   1500000',
        description: 'Debe crear el DataFrame correctamente'
      }
    ],
    tags: ['pandas', 'dataframe', 'csv', 'exportar']
  },

  {
    id: 'ex-3-2-2',
    moduleId: 'module-3',
    lessonId: 'lesson-3-2',
    title: 'Simular Lectura de CSV',
    description: 'Crea un DataFrame que simule datos leídos de un CSV.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd

# Simula datos de un CSV con estas columnas:
# fecha, ticker, precio
# Usa 3 filas de datos
df = pd.DataFrame({
    'fecha': ,
    'ticker': ,
    'precio': 
})

print(df)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'fecha': ['2024-01-01', '2024-01-01', '2024-01-02'],
    'ticker': ['JPM', 'BAC', 'JPM'],
    'precio': [150.0, 35.0, 152.0]
})

print(df)`,
    hints: [
      'Crea un diccionario con tres listas',
      'Cada lista debe tener 3 elementos',
      'Las fechas pueden ser strings'
    ],
    testCases: [
      {
        expectedOutput: '        fecha ticker  precio\n0  2024-01-01    JPM   150.0\n1  2024-01-01    BAC    35.0\n2  2024-01-02    JPM   152.0',
        description: 'Debe crear el DataFrame con las columnas correctas'
      }
    ],
    tags: ['pandas', 'dataframe', 'csv', 'datos']
  },

  {
    id: 'ex-3-2-3',
    moduleId: 'module-3',
    lessonId: 'lesson-3-2',
    title: 'Convertir Fechas',
    description: 'Convierte una columna de strings a tipo datetime.',
    difficulty: 'intermediate',
    xpReward: 25,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'fecha': ['2024-01-01', '2024-01-02', '2024-01-03'],
    'precio': [150.0, 152.0, 151.0]
})

# Convierte la columna fecha a datetime
df['fecha'] = 

print(df)
print(f"\\nTipo de fecha: {df['fecha'].dtype}")`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'fecha': ['2024-01-01', '2024-01-02', '2024-01-03'],
    'precio': [150.0, 152.0, 151.0]
})

df['fecha'] = pd.to_datetime(df['fecha'])

print(df)
print(f"\\nTipo de fecha: {df['fecha'].dtype}")`,
    hints: [
      'Usa pd.to_datetime() para convertir strings a fechas',
      'Asigna el resultado de vuelta a la columna',
      'El tipo resultante será datetime64'
    ],
    testCases: [
      {
        expectedOutput: '       fecha  precio\n0 2024-01-01   150.0\n1 2024-01-02   152.0\n2 2024-01-03   151.0\n\nTipo de fecha: datetime64[ns]',
        description: 'Debe convertir las fechas correctamente'
      }
    ],
    tags: ['pandas', 'datetime', 'conversion', 'fechas']
  },

  {
    id: 'ex-3-2-4',
    moduleId: 'module-3',
    lessonId: 'lesson-3-2',
    title: 'Establecer Índice',
    description: 'Establece la columna ticker como índice del DataFrame.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15]
})

# Establece ticker como índice
df = 

print(df)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15]
})

df = df.set_index('ticker')

print(df)`,
    hints: [
      'Usa el método .set_index("columna")',
      'Asigna el resultado de vuelta a df',
      'La columna ticker se convertirá en el índice'
    ],
    testCases: [
      {
        expectedOutput: '        precio  cantidad\nticker                  \nJPM      150.0        10\nBAC       35.0        20\nC         50.0        15',
        description: 'Debe establecer ticker como índice'
      }
    ],
    tags: ['pandas', 'dataframe', 'indice', 'set_index']
  },

  {
    id: 'ex-3-2-5',
    moduleId: 'module-3',
    lessonId: 'lesson-3-2',
    title: 'Seleccionar Columnas Específicas',
    description: 'Crea un DataFrame con solo las columnas ticker y precio.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15],
    'sector': ['Banca', 'Banca', 'Banca']
})

# Selecciona solo ticker y precio
df_simple = 

print(df_simple)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio': [150.0, 35.0, 50.0],
    'cantidad': [10, 20, 15],
    'sector': ['Banca', 'Banca', 'Banca']
})

df_simple = df[['ticker', 'precio']]

print(df_simple)`,
    hints: [
      'Usa doble corchete con una lista de columnas',
      'df[["col1", "col2"]] selecciona múltiples columnas',
      'El orden de las columnas en la lista importa'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio\n0    JPM   150.0\n1    BAC    35.0\n2      C    50.0',
        description: 'Debe seleccionar solo las columnas especificadas'
      }
    ],
    tags: ['pandas', 'dataframe', 'seleccion', 'columnas']
  },


  // ============================================
  // LESSON 3.3: Filtrado y Selección
  // ============================================

  {
    id: 'ex-3-3-1',
    moduleId: 'module-3',
    lessonId: 'lesson-3-3',
    title: 'Filtrado Simple',
    description: 'Filtra acciones con precio mayor a $50.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

# Filtra acciones con precio > 50
acciones_caras = 

print(acciones_caras)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

acciones_caras = df[df['precio'] > 50]

print(acciones_caras)`,
    hints: [
      'Usa una condición booleana: df[df["columna"] > valor]',
      'La condición crea una máscara True/False',
      'Solo las filas con True se incluyen'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio\n0    JPM   150.0\n4     GS   380.0',
        description: 'Debe filtrar solo precios mayores a 50'
      }
    ],
    tags: ['pandas', 'filtrado', 'condiciones', 'boolean']
  },

  {
    id: 'ex-3-3-2',
    moduleId: 'module-3',
    lessonId: 'lesson-3-3',
    title: 'Filtrado con Múltiples Condiciones',
    description: 'Filtra acciones con precio < $100 Y dividendo > 3%.',
    difficulty: 'intermediate',
    xpReward: 25,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0],
    'dividendo': [3.2, 2.8, 4.1, 3.5]
})

# Filtra: precio < 100 Y dividendo > 3.0
buenas_opciones = 

print(buenas_opciones)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0],
    'dividendo': [3.2, 2.8, 4.1, 3.5]
})

buenas_opciones = df[(df['precio'] < 100) & (df['dividendo'] > 3.0)]

print(buenas_opciones)`,
    hints: [
      'Usa & para AND entre condiciones',
      'Cada condición debe estar entre paréntesis',
      'Sintaxis: df[(cond1) & (cond2)]'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio  dividendo\n2      C    50.0        4.1\n3    WFC    45.0        3.5',
        description: 'Debe filtrar con ambas condiciones'
      }
    ],
    tags: ['pandas', 'filtrado', 'multiples-condiciones', 'and']
  },

  {
    id: 'ex-3-3-3',
    moduleId: 'module-3',
    lessonId: 'lesson-3-3',
    title: 'Filtrar con isin()',
    description: 'Filtra solo las acciones JPM, BAC y C.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

# Filtra solo JPM, BAC y C
bancos_grandes = 

print(bancos_grandes)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

bancos_grandes = df[df['ticker'].isin(['JPM', 'BAC', 'C'])]

print(bancos_grandes)`,
    hints: [
      'Usa el método .isin() con una lista de valores',
      'Sintaxis: df[df["columna"].isin([valores])]',
      'Retorna True si el valor está en la lista'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio\n0    JPM   150.0\n1    BAC    35.0\n2      C    50.0',
        description: 'Debe filtrar solo los tickers especificados'
      }
    ],
    tags: ['pandas', 'filtrado', 'isin', 'lista']
  },

  {
    id: 'ex-3-3-4',
    moduleId: 'module-3',
    lessonId: 'lesson-3-3',
    title: 'Ordenar por Columna',
    description: 'Ordena el DataFrame por precio de mayor a menor.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0]
})

# Ordena por precio descendente
df_ordenado = 

print(df_ordenado)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0]
})

df_ordenado = df.sort_values('precio', ascending=False)

print(df_ordenado)`,
    hints: [
      'Usa el método .sort_values("columna")',
      'ascending=False ordena de mayor a menor',
      'Por defecto ordena ascendente (menor a mayor)'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio\n0    JPM   150.0\n2      C    50.0\n3    WFC    45.0\n1    BAC    35.0',
        description: 'Debe ordenar por precio descendente'
      }
    ],
    tags: ['pandas', 'ordenamiento', 'sort_values']
  },

  {
    id: 'ex-3-3-5',
    moduleId: 'module-3',
    lessonId: 'lesson-3-3',
    title: 'Top N con nlargest()',
    description: 'Obtén las 3 acciones más caras.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

# Obtén las 3 más caras
top_3 = 

print(top_3)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

top_3 = df.nlargest(3, 'precio')

print(top_3)`,
    hints: [
      'Usa el método .nlargest(n, "columna")',
      'n es el número de filas a retornar',
      'Retorna las n filas con los valores más grandes'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio\n4     GS   380.0\n0    JPM   150.0\n2      C    50.0',
        description: 'Debe retornar las 3 acciones más caras'
      }
    ],
    tags: ['pandas', 'seleccion', 'nlargest', 'top']
  },

  {
    id: 'ex-3-3-6',
    moduleId: 'module-3',
    lessonId: 'lesson-3-3',
    title: 'Filtrar con between()',
    description: 'Filtra acciones con precio entre $40 y $100.',
    difficulty: 'intermediate',
    xpReward: 25,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

# Filtra precios entre 40 y 100
rango_medio = 

print(rango_medio)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

rango_medio = df[df['precio'].between(40, 100)]

print(rango_medio)`,
    hints: [
      'Usa el método .between(min, max)',
      'Incluye ambos extremos (40 y 100)',
      'Sintaxis: df[df["columna"].between(min, max)]'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio\n2      C    50.0\n3    WFC    45.0',
        description: 'Debe filtrar precios en el rango especificado'
      }
    ],
    tags: ['pandas', 'filtrado', 'between', 'rango']
  },

  {
    id: 'ex-3-3-7',
    moduleId: 'module-3',
    lessonId: 'lesson-3-3',
    title: 'Filtrado con OR',
    description: 'Filtra acciones con precio < $40 O precio > $300.',
    difficulty: 'intermediate',
    xpReward: 25,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

# Filtra: precio < 40 O precio > 300
extremos = 

print(extremos)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC', 'GS'],
    'precio': [150.0, 35.0, 50.0, 45.0, 380.0]
})

extremos = df[(df['precio'] < 40) | (df['precio'] > 300)]

print(extremos)`,
    hints: [
      'Usa | para OR entre condiciones',
      'Cada condición debe estar entre paréntesis',
      'Sintaxis: df[(cond1) | (cond2)]'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio\n1    BAC    35.0\n4     GS   380.0',
        description: 'Debe filtrar con condición OR'
      }
    ],
    tags: ['pandas', 'filtrado', 'or', 'multiples-condiciones']
  },

  // ============================================
  // LESSON 3.4: Operaciones Básicas
  // ============================================

  {
    id: 'ex-3-4-1',
    moduleId: 'module-3',
    lessonId: 'lesson-3-4',
    title: 'Operaciones Aritméticas',
    description: 'Calcula el rendimiento porcentual de cada acción.',
    difficulty: 'intermediate',
    xpReward: 25,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio_compra': [140.0, 30.0, 45.0],
    'precio_actual': [150.0, 35.0, 50.0]
})

# Calcula rendimiento porcentual
df['rendimiento_%'] = 

print(df)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'precio_compra': [140.0, 30.0, 45.0],
    'precio_actual': [150.0, 35.0, 50.0]
})

df['rendimiento_%'] = ((df['precio_actual'] - df['precio_compra']) / df['precio_compra']) * 100

print(df)`,
    hints: [
      'Fórmula: ((actual - compra) / compra) * 100',
      'Las operaciones se aplican elemento por elemento',
      'Crea una nueva columna con el resultado'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio_compra  precio_actual  rendimiento_%\n0    JPM          140.0          150.0       7.142857\n1    BAC           30.0           35.0      16.666667\n2      C           45.0           50.0      11.111111',
        description: 'Debe calcular el rendimiento correctamente'
      }
    ],
    tags: ['pandas', 'operaciones', 'aritmetica', 'rendimiento']
  },

  {
    id: 'ex-3-4-2',
    moduleId: 'module-3',
    lessonId: 'lesson-3-4',
    title: 'GroupBy Simple',
    description: 'Agrupa transacciones por ticker y suma las cantidades.',
    difficulty: 'intermediate',
    xpReward: 30,
    starterCode: `import pandas as pd

transacciones = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'JPM', 'BAC', 'JPM'],
    'cantidad': [10, 20, 5, 15, 8]
})

# Agrupa por ticker y suma cantidades
total_por_ticker = 

print(total_por_ticker)`,
    solution: `import pandas as pd

transacciones = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'JPM', 'BAC', 'JPM'],
    'cantidad': [10, 20, 5, 15, 8]
})

total_por_ticker = transacciones.groupby('ticker')['cantidad'].sum()

print(total_por_ticker)`,
    hints: [
      'Usa .groupby("columna") para agrupar',
      'Selecciona la columna a agregar con ["columna"]',
      'Usa .sum() para sumar los valores'
    ],
    testCases: [
      {
        expectedOutput: 'ticker\nBAC    35\nJPM    23\nName: cantidad, dtype: int64',
        description: 'Debe agrupar y sumar correctamente'
      }
    ],
    tags: ['pandas', 'groupby', 'agregacion', 'sum']
  },

  {
    id: 'ex-3-4-3',
    moduleId: 'module-3',
    lessonId: 'lesson-3-4',
    title: 'Merge de DataFrames',
    description: 'Combina dos DataFrames usando merge.',
    difficulty: 'intermediate',
    xpReward: 30,
    starterCode: `import pandas as pd

info = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'nombre': ['JPMorgan', 'Bank of America', 'Citigroup']
})

precios = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'WFC'],
    'precio': [150.0, 35.0, 45.0]
})

# Combina con inner join
resultado = 

print(resultado)`,
    solution: `import pandas as pd

info = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C'],
    'nombre': ['JPMorgan', 'Bank of America', 'Citigroup']
})

precios = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'WFC'],
    'precio': [150.0, 35.0, 45.0]
})

resultado = pd.merge(info, precios, on='ticker', how='inner')

print(resultado)`,
    hints: [
      'Usa pd.merge(df1, df2, on="columna")',
      'how="inner" solo incluye coincidencias',
      'La columna "ticker" es común a ambos DataFrames'
    ],
    testCases: [
      {
        expectedOutput: '  ticker            nombre  precio\n0    JPM          JPMorgan   150.0\n1    BAC  Bank of America    35.0',
        description: 'Debe combinar solo las filas coincidentes'
      }
    ],
    tags: ['pandas', 'merge', 'join', 'combinacion']
  },

  {
    id: 'ex-3-4-4',
    moduleId: 'module-3',
    lessonId: 'lesson-3-4',
    title: 'Detectar Valores Faltantes',
    description: 'Cuenta cuántos valores NaN hay en cada columna.',
    difficulty: 'beginner',
    xpReward: 20,
    starterCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, None, 50.0, 45.0],
    'dividendo': [3.2, 2.8, None, 3.5]
})

# Cuenta NaN por columna
nan_por_columna = 

print(nan_por_columna)`,
    solution: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, None, 50.0, 45.0],
    'dividendo': [3.2, 2.8, None, 3.5]
})

nan_por_columna = df.isnull().sum()

print(nan_por_columna)`,
    hints: [
      'Usa .isnull() para detectar NaN',
      'Usa .sum() para contar True por columna',
      'Encadena los métodos: df.isnull().sum()'
    ],
    testCases: [
      {
        expectedOutput: 'ticker       0\nprecio       1\ndividendo    1\ndtype: int64',
        description: 'Debe contar NaN correctamente'
      }
    ],
    tags: ['pandas', 'nan', 'valores-faltantes', 'isnull']
  },

  {
    id: 'ex-3-4-5',
    moduleId: 'module-3',
    lessonId: 'lesson-3-4',
    title: 'Rellenar Valores Faltantes',
    description: 'Rellena los NaN con el promedio de la columna.',
    difficulty: 'intermediate',
    xpReward: 30,
    starterCode: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, None, 50.0, 45.0]
})

# Rellena NaN con el promedio
df['precio'] = 

print(df)`,
    solution: `import pandas as pd
import numpy as np

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, None, 50.0, 45.0]
})

df['precio'] = df['precio'].fillna(df['precio'].mean())

print(df)`,
    hints: [
      'Usa .fillna(valor) para rellenar NaN',
      'Calcula el promedio con .mean()',
      'Combina: df["col"].fillna(df["col"].mean())'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio\n0    JPM   150.0\n1    BAC    81.666667\n2      C    50.0\n3    WFC    45.0',
        description: 'Debe rellenar NaN con el promedio'
      }
    ],
    tags: ['pandas', 'nan', 'fillna', 'promedio']
  },

  {
    id: 'ex-3-4-6',
    moduleId: 'module-3',
    lessonId: 'lesson-3-4',
    title: 'Apply con Lambda',
    description: 'Usa apply() para clasificar precios como Alto, Medio o Bajo.',
    difficulty: 'intermediate',
    xpReward: 30,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0]
})

# Clasifica: >100=Alto, >50=Medio, resto=Bajo
df['categoria'] = df['precio'].apply(
    lambda x: 
)

print(df)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'BAC', 'C', 'WFC'],
    'precio': [150.0, 35.0, 50.0, 45.0]
})

df['categoria'] = df['precio'].apply(
    lambda x: 'Alto' if x > 100 else 'Medio' if x > 50 else 'Bajo'
)

print(df)`,
    hints: [
      'Usa lambda con if-else ternario',
      'Sintaxis: lambda x: "A" if cond1 else "B" if cond2 else "C"',
      'Se aplica a cada elemento de la columna'
    ],
    testCases: [
      {
        expectedOutput: '  ticker  precio categoria\n0    JPM   150.0      Alto\n1    BAC    35.0      Bajo\n2      C    50.0      Bajo\n3    WFC    45.0      Bajo',
        description: 'Debe clasificar correctamente'
      }
    ],
    tags: ['pandas', 'apply', 'lambda', 'clasificacion']
  },

  {
    id: 'ex-3-4-7',
    moduleId: 'module-3',
    lessonId: 'lesson-3-4',
    title: 'GroupBy con Múltiples Agregaciones',
    description: 'Calcula promedio y máximo de precio por ticker.',
    difficulty: 'advanced',
    xpReward: 35,
    starterCode: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'JPM', 'BAC', 'BAC', 'JPM'],
    'precio': [150, 152, 35, 36, 151]
})

# Agrupa y calcula promedio y máximo
estadisticas = 

print(estadisticas)`,
    solution: `import pandas as pd

df = pd.DataFrame({
    'ticker': ['JPM', 'JPM', 'BAC', 'BAC', 'JPM'],
    'precio': [150, 152, 35, 36, 151]
})

estadisticas = df.groupby('ticker')['precio'].agg(['mean', 'max'])

print(estadisticas)`,
    hints: [
      'Usa .agg() con una lista de funciones',
      'Sintaxis: .groupby("col")["col2"].agg(["func1", "func2"])',
      'Las funciones pueden ser "mean", "max", "min", "sum", etc.'
    ],
    testCases: [
      {
        expectedOutput: '             mean  max\nticker                \nBAC      35.5   36\nJPM     151.0  152',
        description: 'Debe calcular múltiples estadísticas'
      }
    ],
    tags: ['pandas', 'groupby', 'agg', 'estadisticas']
  }
];
