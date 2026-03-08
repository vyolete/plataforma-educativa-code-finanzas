import { module3Exercises } from './module3-exercises';

export interface Exercise {
  id: string;
  moduleId: string;
  lessonId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: {
    input?: string;
    expectedOutput: string;
    description: string;
  }[];
  tags: string[];
}

const baseExercises: Exercise[] = [
  // ============================================
  // MODULE 1: FUNDAMENTOS DE PYTHON
  // ============================================
  
  // Lesson 1.1: Variables y Tipos de Datos
  {
    id: 'ex-1-1-1',
    moduleId: 'module-1',
    lessonId: 'lesson-1-1',
    title: 'Crear Variables Básicas',
    description: 'Crea tres variables: nombre (string), edad (int), y altura (float).',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `# Crea las variables aquí
nombre = 
edad = 
altura = 

print(nombre, edad, altura)`,
    solution: `nombre = "Juan"
edad = 25
altura = 1.75

print(nombre, edad, altura)`,
    hints: [
      'Los strings van entre comillas: "texto"',
      'Los números enteros no llevan comillas: 25',
      'Los decimales usan punto: 1.75'
    ],
    testCases: [
      {
        expectedOutput: 'Juan 25 1.75',
        description: 'Debe imprimir las tres variables'
      }
    ],
    tags: ['variables', 'tipos-datos', 'basico']
  },
  {
    id: 'ex-1-1-2',
    moduleId: 'module-1',
    lessonId: 'lesson-1-1',
    title: 'Conversión de Tipos',
    description: 'Convierte un string "100" a entero y súmale 50.',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `precio_texto = "100"
# Convierte a entero y suma 50
precio_total = 

print(precio_total)`,
    solution: `precio_texto = "100"
precio_total = int(precio_texto) + 50

print(precio_total)`,
    hints: [
      'Usa int() para convertir string a entero',
      'Luego puedes sumar normalmente'
    ],
    testCases: [
      {
        expectedOutput: '150',
        description: 'Debe imprimir 150'
      }
    ],
    tags: ['conversion', 'tipos-datos', 'int']
  },
  {
    id: 'ex-1-1-3',
    moduleId: 'module-1',
    lessonId: 'lesson-1-1',
    title: 'Tipo Boolean',
    description: 'Crea una variable booleana que indique si un precio es mayor a 100.',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `precio = 150
# Crea una variable booleana
es_caro = 

print(es_caro)`,
    solution: `precio = 150
es_caro = precio > 100

print(es_caro)`,
    hints: [
      'Usa el operador > para comparar',
      'El resultado de una comparación es True o False'
    ],
    testCases: [
      {
        expectedOutput: 'True',
        description: 'Debe imprimir True porque 150 > 100'
      }
    ],
    tags: ['boolean', 'comparacion', 'variables']
  },
  {
    id: 'ex-1-1-4',
    moduleId: 'module-1',
    lessonId: 'lesson-1-1',
    title: 'F-Strings Básicos',
    description: 'Usa f-strings para formatear un mensaje con variables.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `accion = "ECOPETROL"
precio = 2850.50
# Usa f-string para crear el mensaje
mensaje = 

print(mensaje)`,
    solution: `accion = "ECOPETROL"
precio = 2850.50
mensaje = f"La acción {accion} tiene un precio de \${precio}"

print(mensaje)`,
    hints: [
      'Los f-strings empiezan con f antes de las comillas',
      'Las variables van entre llaves: {variable}',
      'Escapa el símbolo $ con \\$ en TypeScript'
    ],
    testCases: [
      {
        expectedOutput: 'La acción ECOPETROL tiene un precio de $2850.5',
        description: 'Debe formatear correctamente el mensaje'
      }
    ],
    tags: ['f-strings', 'formato', 'variables']
  },
  {
    id: 'ex-1-1-5',
    moduleId: 'module-1',
    lessonId: 'lesson-1-1',
    title: 'Múltiples Variables',
    description: 'Crea variables para una acción bancaria: nombre, precio, cantidad, y calcula el total.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `# Crea las variables
banco = "Bancolombia"
precio_accion = 35000
cantidad = 10
# Calcula el total
total = 

print(f"Total invertido en {banco}: \${total}")`,
    solution: `banco = "Bancolombia"
precio_accion = 35000
cantidad = 10
total = precio_accion * cantidad

print(f"Total invertido en {banco}: \${total}")`,
    hints: [
      'Multiplica precio por cantidad',
      'Usa f-string para el mensaje final'
    ],
    testCases: [
      {
        expectedOutput: 'Total invertido en Bancolombia: $350000',
        description: 'Debe calcular e imprimir el total correctamente'
      }
    ],
    tags: ['variables', 'operaciones', 'f-strings']
  },

  // Lesson 1.2: Operadores
  {
    id: 'ex-1-2-1',
    moduleId: 'module-1',
    lessonId: 'lesson-1-2',
    title: 'Operadores Aritméticos',
    description: 'Calcula el rendimiento de una inversión: (precio_final - precio_inicial) / precio_inicial * 100',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `precio_inicial = 1000
precio_final = 1150
# Calcula el rendimiento porcentual
rendimiento = 

print(f"Rendimiento: {rendimiento}%")`,
    solution: `precio_inicial = 1000
precio_final = 1150
rendimiento = (precio_final - precio_inicial) / precio_inicial * 100

print(f"Rendimiento: {rendimiento}%")`,
    hints: [
      'Resta precio_final - precio_inicial',
      'Divide entre precio_inicial',
      'Multiplica por 100 para obtener porcentaje'
    ],
    testCases: [
      {
        expectedOutput: 'Rendimiento: 15.0%',
        description: 'Debe calcular el rendimiento correctamente'
      }
    ],
    tags: ['operadores', 'aritmetica', 'finanzas']
  },
  {
    id: 'ex-1-2-2',
    moduleId: 'module-1',
    lessonId: 'lesson-1-2',
    title: 'Operador Módulo',
    description: 'Usa el operador % para verificar si un número de acciones es par.',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `acciones = 47
# Calcula el residuo al dividir entre 2
residuo = 

print(f"Residuo: {residuo}")`,
    solution: `acciones = 47
residuo = acciones % 2

print(f"Residuo: {residuo}")`,
    hints: [
      'El operador % devuelve el residuo de una división',
      'Si el residuo es 0, el número es par'
    ],
    testCases: [
      {
        expectedOutput: 'Residuo: 1',
        description: 'Debe imprimir 1 (47 es impar)'
      }
    ],
    tags: ['operadores', 'modulo', 'matematicas']
  },
  {
    id: 'ex-1-2-3',
    moduleId: 'module-1',
    lessonId: 'lesson-1-2',
    title: 'Operadores de Comparación',
    description: 'Compara dos precios de acciones y determina cuál es mayor.',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `precio_a = 2500
precio_b = 3000
# Compara si precio_b es mayor que precio_a
es_mayor = 

print(es_mayor)`,
    solution: `precio_a = 2500
precio_b = 3000
es_mayor = precio_b > precio_a

print(es_mayor)`,
    hints: [
      'Usa el operador > para comparar',
      'El resultado es un booleano (True/False)'
    ],
    testCases: [
      {
        expectedOutput: 'True',
        description: 'Debe imprimir True porque 3000 > 2500'
      }
    ],
    tags: ['operadores', 'comparacion', 'boolean']
  },
  {
    id: 'ex-1-2-4',
    moduleId: 'module-1',
    lessonId: 'lesson-1-2',
    title: 'Operadores Lógicos',
    description: 'Usa operadores lógicos para verificar si un precio está en un rango.',
    difficulty: 'intermediate',
    xpReward: 15,
    starterCode: `precio = 2750
# Verifica si el precio está entre 2000 y 3000
en_rango = 

print(en_rango)`,
    solution: `precio = 2750
en_rango = precio >= 2000 and precio <= 3000

print(en_rango)`,
    hints: [
      'Usa el operador "and" para combinar condiciones',
      'Verifica que sea >= 2000 Y <= 3000'
    ],
    testCases: [
      {
        expectedOutput: 'True',
        description: 'Debe imprimir True porque 2750 está en el rango'
      }
    ],
    tags: ['operadores', 'logicos', 'and']
  },
  {
    id: 'ex-1-2-5',
    moduleId: 'module-1',
    lessonId: 'lesson-1-2',
    title: 'Operadores Combinados',
    description: 'Calcula el valor futuro de una inversión con interés compuesto: VF = VP * (1 + r)^n',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `valor_presente = 10000
tasa_interes = 0.05  # 5%
años = 3
# Calcula el valor futuro
valor_futuro = 

print(f"Valor futuro: \${valor_futuro:.2f}")`,
    solution: `valor_presente = 10000
tasa_interes = 0.05
años = 3
valor_futuro = valor_presente * (1 + tasa_interes) ** años

print(f"Valor futuro: \${valor_futuro:.2f}")`,
    hints: [
      'Usa el operador ** para potencias',
      'La fórmula es VP * (1 + r)^n',
      'Usa :.2f en el f-string para 2 decimales'
    ],
    testCases: [
      {
        expectedOutput: 'Valor futuro: $11576.25',
        description: 'Debe calcular el valor futuro con interés compuesto'
      }
    ],
    tags: ['operadores', 'potencia', 'finanzas', 'interes-compuesto']
  },

  // Lesson 1.3: Estructuras de Control
  {
    id: 'ex-1-3-1',
    moduleId: 'module-1',
    lessonId: 'lesson-1-3',
    title: 'If Simple',
    description: 'Usa if para verificar si un precio es mayor a 1000.',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `precio = 1500
# Usa if para verificar
if :
    print("Precio alto")`,
    solution: `precio = 1500
if precio > 1000:
    print("Precio alto")`,
    hints: [
      'La condición va después del if',
      'No olvides los dos puntos :',
      'La indentación es importante en Python'
    ],
    testCases: [
      {
        expectedOutput: 'Precio alto',
        description: 'Debe imprimir "Precio alto" porque 1500 > 1000'
      }
    ],
    tags: ['if', 'condicionales', 'control-flujo']
  },
  {
    id: 'ex-1-3-2',
    moduleId: 'module-1',
    lessonId: 'lesson-1-3',
    title: 'If-Else',
    description: 'Usa if-else para clasificar un rendimiento como positivo o negativo.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `rendimiento = 5.5
# Clasifica el rendimiento
if :
    print("Rendimiento positivo")
else:
    print("Rendimiento negativo")`,
    solution: `rendimiento = 5.5
if rendimiento > 0:
    print("Rendimiento positivo")
else:
    print("Rendimiento negativo")`,
    hints: [
      'Compara si rendimiento es mayor que 0',
      'Usa else para el caso contrario'
    ],
    testCases: [
      {
        expectedOutput: 'Rendimiento positivo',
        description: 'Debe imprimir "Rendimiento positivo" porque 5.5 > 0'
      }
    ],
    tags: ['if-else', 'condicionales', 'control-flujo']
  },
  {
    id: 'ex-1-3-3',
    moduleId: 'module-1',
    lessonId: 'lesson-1-3',
    title: 'If-Elif-Else',
    description: 'Clasifica un precio en bajo, medio o alto.',
    difficulty: 'intermediate',
    xpReward: 15,
    starterCode: `precio = 2500
# Clasifica el precio
if :
    print("Precio bajo")
elif :
    print("Precio medio")
else:
    print("Precio alto")`,
    solution: `precio = 2500
if precio < 2000:
    print("Precio bajo")
elif precio <= 3000:
    print("Precio medio")
else:
    print("Precio alto")`,
    hints: [
      'Usa if para < 2000',
      'Usa elif para <= 3000',
      'Usa else para el resto'
    ],
    testCases: [
      {
        expectedOutput: 'Precio medio',
        description: 'Debe imprimir "Precio medio" porque 2500 está entre 2000 y 3000'
      }
    ],
    tags: ['if-elif-else', 'condicionales', 'clasificacion']
  },
  {
    id: 'ex-1-3-4',
    moduleId: 'module-1',
    lessonId: 'lesson-1-3',
    title: 'For Loop Básico',
    description: 'Usa un for loop para imprimir los números del 1 al 5.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `# Usa for con range
for i in :
    print(i)`,
    solution: `for i in range(1, 6):
    print(i)`,
    hints: [
      'Usa range(1, 6) para números del 1 al 5',
      'El segundo número en range es exclusivo'
    ],
    testCases: [
      {
        expectedOutput: '1\n2\n3\n4\n5',
        description: 'Debe imprimir números del 1 al 5'
      }
    ],
    tags: ['for', 'loops', 'range']
  },
  {
    id: 'ex-1-3-5',
    moduleId: 'module-1',
    lessonId: 'lesson-1-3',
    title: 'While Loop',
    description: 'Usa un while loop para sumar números hasta que la suma sea mayor a 100.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `suma = 0
numero = 1
# Usa while para sumar
while :
    suma += numero
    numero += 1

print(f"Suma final: {suma}")`,
    solution: `suma = 0
numero = 1
while suma <= 100:
    suma += numero
    numero += 1

print(f"Suma final: {suma}")`,
    hints: [
      'La condición debe ser suma <= 100',
      'Incrementa numero en cada iteración'
    ],
    testCases: [
      {
        expectedOutput: 'Suma final: 105',
        description: 'Debe sumar hasta que sea mayor a 100'
      }
    ],
    tags: ['while', 'loops', 'acumulador']
  },

  // Lesson 1.4: Funciones
  {
    id: 'ex-1-4-1',
    moduleId: 'module-1',
    lessonId: 'lesson-1-4',
    title: 'Función Simple',
    description: 'Crea una función que salude a una persona.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `# Define la función
def saludar(nombre):
    

# Prueba la función
saludar("Ana")`,
    solution: `def saludar(nombre):
    print(f"Hola, {nombre}!")

saludar("Ana")`,
    hints: [
      'Usa def para definir la función',
      'Usa f-string para incluir el nombre'
    ],
    testCases: [
      {
        expectedOutput: 'Hola, Ana!',
        description: 'Debe saludar correctamente'
      }
    ],
    tags: ['funciones', 'def', 'parametros']
  },
  {
    id: 'ex-1-4-2',
    moduleId: 'module-1',
    lessonId: 'lesson-1-4',
    title: 'Función con Return',
    description: 'Crea una función que calcule el área de un rectángulo.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `# Define la función
def calcular_area(base, altura):
    

# Prueba la función
area = calcular_area(5, 10)
print(f"Área: {area}")`,
    solution: `def calcular_area(base, altura):
    return base * altura

area = calcular_area(5, 10)
print(f"Área: {area}")`,
    hints: [
      'Multiplica base por altura',
      'Usa return para devolver el resultado'
    ],
    testCases: [
      {
        expectedOutput: 'Área: 50',
        description: 'Debe calcular el área correctamente'
      }
    ],
    tags: ['funciones', 'return', 'parametros']
  },
  {
    id: 'ex-1-4-3',
    moduleId: 'module-1',
    lessonId: 'lesson-1-4',
    title: 'Función con Parámetros por Defecto',
    description: 'Crea una función que calcule interés simple con tasa por defecto de 5%.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `# Define la función con parámetro por defecto
def calcular_interes(capital, años, tasa=0.05):
    

# Prueba la función
interes = calcular_interes(10000, 3)
print(f"Interés: \${interes}")`,
    solution: `def calcular_interes(capital, años, tasa=0.05):
    return capital * tasa * años

interes = calcular_interes(10000, 3)
print(f"Interés: \${interes}")`,
    hints: [
      'La fórmula es capital * tasa * años',
      'El parámetro tasa tiene valor por defecto 0.05'
    ],
    testCases: [
      {
        expectedOutput: 'Interés: $1500.0',
        description: 'Debe calcular el interés con tasa por defecto'
      }
    ],
    tags: ['funciones', 'parametros-defecto', 'finanzas']
  },
  {
    id: 'ex-1-4-4',
    moduleId: 'module-1',
    lessonId: 'lesson-1-4',
    title: 'Función con Múltiples Returns',
    description: 'Crea una función que clasifique un rendimiento y retorne un mensaje.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `# Define la función
def clasificar_rendimiento(rendimiento):
    if :
        return "Excelente"
    elif :
        return "Bueno"
    else:
        return "Bajo"

# Prueba la función
resultado = clasificar_rendimiento(8.5)
print(resultado)`,
    solution: `def clasificar_rendimiento(rendimiento):
    if rendimiento > 10:
        return "Excelente"
    elif rendimiento > 5:
        return "Bueno"
    else:
        return "Bajo"

resultado = clasificar_rendimiento(8.5)
print(resultado)`,
    hints: [
      'Usa if para > 10',
      'Usa elif para > 5',
      'Usa else para el resto'
    ],
    testCases: [
      {
        expectedOutput: 'Bueno',
        description: 'Debe clasificar 8.5 como "Bueno"'
      }
    ],
    tags: ['funciones', 'condicionales', 'return']
  },
  {
    id: 'ex-1-4-5',
    moduleId: 'module-1',
    lessonId: 'lesson-1-4',
    title: 'Función Financiera Completa',
    description: 'Crea una función que calcule el valor presente de una inversión: VP = VF / (1 + r)^n',
    difficulty: 'advanced',
    xpReward: 25,
    starterCode: `# Define la función
def calcular_valor_presente(valor_futuro, tasa, años):
    

# Prueba la función
vp = calcular_valor_presente(15000, 0.08, 5)
print(f"Valor presente: \${vp:.2f}")`,
    solution: `def calcular_valor_presente(valor_futuro, tasa, años):
    return valor_futuro / (1 + tasa) ** años

vp = calcular_valor_presente(15000, 0.08, 5)
print(f"Valor presente: \${vp:.2f}")`,
    hints: [
      'La fórmula es VF / (1 + r)^n',
      'Usa el operador ** para potencias',
      'Usa :.2f para formatear a 2 decimales'
    ],
    testCases: [
      {
        expectedOutput: 'Valor presente: $10206.70',
        description: 'Debe calcular el valor presente correctamente'
      }
    ],
    tags: ['funciones', 'finanzas', 'valor-presente']
  },

  // ============================================
  // MODULE 2: ESTRUCTURAS DE DATOS
  // ============================================
  
  // Lesson 2.1: Listas y Tuplas
  {
    id: 'ex-2-1-1',
    moduleId: 'module-2',
    lessonId: 'lesson-2-1',
    title: 'Crear y Acceder a Listas',
    description: 'Crea una lista de precios de acciones y accede al primer y último elemento.',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `# Crea la lista
precios = [2500, 3000, 2800, 3200, 2900]
# Accede al primer elemento
primero = 
# Accede al último elemento
ultimo = 

print(f"Primero: {primero}, Último: {ultimo}")`,
    solution: `precios = [2500, 3000, 2800, 3200, 2900]
primero = precios[0]
ultimo = precios[-1]

print(f"Primero: {primero}, Último: {ultimo}")`,
    hints: [
      'El índice 0 accede al primer elemento',
      'El índice -1 accede al último elemento'
    ],
    testCases: [
      {
        expectedOutput: 'Primero: 2500, Último: 2900',
        description: 'Debe acceder correctamente al primer y último elemento'
      }
    ],
    tags: ['listas', 'indexacion', 'acceso']
  },
  {
    id: 'ex-2-1-2',
    moduleId: 'module-2',
    lessonId: 'lesson-2-1',
    title: 'Métodos de Listas',
    description: 'Usa append() para agregar un precio y len() para contar elementos.',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `precios = [2500, 3000, 2800]
# Agrega un nuevo precio
precios.
# Cuenta los elementos
cantidad = 

print(f"Precios: {precios}")
print(f"Cantidad: {cantidad}")`,
    solution: `precios = [2500, 3000, 2800]
precios.append(3200)
cantidad = len(precios)

print(f"Precios: {precios}")
print(f"Cantidad: {cantidad}")`,
    hints: [
      'Usa .append(valor) para agregar al final',
      'Usa len(lista) para contar elementos'
    ],
    testCases: [
      {
        expectedOutput: 'Precios: [2500, 3000, 2800, 3200]\nCantidad: 4',
        description: 'Debe agregar el precio y contar correctamente'
      }
    ],
    tags: ['listas', 'append', 'len']
  },
  {
    id: 'ex-2-1-3',
    moduleId: 'module-2',
    lessonId: 'lesson-2-1',
    title: 'Slicing de Listas',
    description: 'Usa slicing para obtener los primeros 3 elementos de una lista.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `precios = [2500, 3000, 2800, 3200, 2900, 3100]
# Obtén los primeros 3 elementos
primeros_tres = 

print(primeros_tres)`,
    solution: `precios = [2500, 3000, 2800, 3200, 2900, 3100]
primeros_tres = precios[:3]

print(primeros_tres)`,
    hints: [
      'Usa [:3] para obtener los primeros 3 elementos',
      'El slicing es [inicio:fin] donde fin es exclusivo'
    ],
    testCases: [
      {
        expectedOutput: '[2500, 3000, 2800]',
        description: 'Debe obtener los primeros 3 elementos'
      }
    ],
    tags: ['listas', 'slicing', 'subconjuntos']
  },
  {
    id: 'ex-2-1-4',
    moduleId: 'module-2',
    lessonId: 'lesson-2-1',
    title: 'Tuplas Inmutables',
    description: 'Crea una tupla con información de una acción (nombre, precio, cantidad).',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `# Crea la tupla
accion = ("Bancolombia", 35000, 10)
# Accede a cada elemento
nombre = 
precio = 
cantidad = 

print(f"{nombre}: \${precio} x {cantidad}")`,
    solution: `accion = ("Bancolombia", 35000, 10)
nombre = accion[0]
precio = accion[1]
cantidad = accion[2]

print(f"{nombre}: \${precio} x {cantidad}")`,
    hints: [
      'Las tuplas usan paréntesis ()',
      'Accede a elementos con índices como en listas'
    ],
    testCases: [
      {
        expectedOutput: 'Bancolombia: $35000 x 10',
        description: 'Debe acceder correctamente a los elementos de la tupla'
      }
    ],
    tags: ['tuplas', 'inmutabilidad', 'indexacion']
  },
  {
    id: 'ex-2-1-5',
    moduleId: 'module-2',
    lessonId: 'lesson-2-1',
    title: 'Iterar sobre Listas',
    description: 'Usa un for loop para calcular el promedio de una lista de precios.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `precios = [2500, 3000, 2800, 3200, 2900]
# Calcula la suma
suma = 0
for precio in :
    suma += precio
# Calcula el promedio
promedio = 

print(f"Promedio: \${promedio}")`,
    solution: `precios = [2500, 3000, 2800, 3200, 2900]
suma = 0
for precio in precios:
    suma += precio
promedio = suma / len(precios)

print(f"Promedio: \${promedio}")`,
    hints: [
      'Itera sobre precios con for precio in precios',
      'Suma cada precio a la variable suma',
      'Divide la suma entre len(precios)'
    ],
    testCases: [
      {
        expectedOutput: 'Promedio: $2880.0',
        description: 'Debe calcular el promedio correctamente'
      }
    ],
    tags: ['listas', 'for', 'promedio', 'iteracion']
  },

  // Lesson 2.2: Diccionarios y Sets
  {
    id: 'ex-2-2-1',
    moduleId: 'module-2',
    lessonId: 'lesson-2-2',
    title: 'Crear y Acceder a Diccionarios',
    description: 'Crea un diccionario con información de una acción y accede a sus valores.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `# Crea el diccionario
accion = {
    "nombre": "Bancolombia",
    "precio": 35000,
    "cantidad": 10
}
# Accede a los valores
nombre = 
precio = 

print(f"{nombre}: \${precio}")`,
    solution: `accion = {
    "nombre": "Bancolombia",
    "precio": 35000,
    "cantidad": 10
}
nombre = accion["nombre"]
precio = accion["precio"]

print(f"{nombre}: \${precio}")`,
    hints: [
      'Los diccionarios usan llaves {}',
      'Accede a valores con diccionario["clave"]'
    ],
    testCases: [
      {
        expectedOutput: 'Bancolombia: $35000',
        description: 'Debe acceder correctamente a los valores del diccionario'
      }
    ],
    tags: ['diccionarios', 'acceso', 'claves']
  },
  {
    id: 'ex-2-2-2',
    moduleId: 'module-2',
    lessonId: 'lesson-2-2',
    title: 'Métodos de Diccionarios',
    description: 'Usa .get() y .keys() para trabajar con diccionarios.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `portafolio = {
    "ECOPETROL": 2850,
    "Bancolombia": 35000,
    "Grupo Aval": 1200
}
# Obtén el precio de ECOPETROL
precio = portafolio.get("ECOPETROL")
# Obtén todas las claves
acciones = list(portafolio.keys())

print(f"Precio ECOPETROL: \${precio}")
print(f"Acciones: {acciones}")`,
    solution: `portafolio = {
    "ECOPETROL": 2850,
    "Bancolombia": 35000,
    "Grupo Aval": 1200
}
precio = portafolio.get("ECOPETROL")
acciones = list(portafolio.keys())

print(f"Precio ECOPETROL: \${precio}")
print(f"Acciones: {acciones}")`,
    hints: [
      'Usa .get("clave") para obtener un valor',
      'Usa .keys() para obtener todas las claves'
    ],
    testCases: [
      {
        expectedOutput: "Precio ECOPETROL: $2850\nAcciones: ['ECOPETROL', 'Bancolombia', 'Grupo Aval']",
        description: 'Debe obtener el precio y las claves correctamente'
      }
    ],
    tags: ['diccionarios', 'get', 'keys']
  },
  {
    id: 'ex-2-2-3',
    moduleId: 'module-2',
    lessonId: 'lesson-2-2',
    title: 'Iterar sobre Diccionarios',
    description: 'Itera sobre un diccionario para calcular el valor total del portafolio.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `portafolio = {
    "ECOPETROL": 2850,
    "Bancolombia": 35000,
    "Grupo Aval": 1200
}
# Calcula el total
total = 0
for accion, precio in portafolio.:
    total += precio

print(f"Valor total: \${total}")`,
    solution: `portafolio = {
    "ECOPETROL": 2850,
    "Bancolombia": 35000,
    "Grupo Aval": 1200
}
total = 0
for accion, precio in portafolio.items():
    total += precio

print(f"Valor total: \${total}")`,
    hints: [
      'Usa .items() para iterar sobre claves y valores',
      'Suma cada precio al total'
    ],
    testCases: [
      {
        expectedOutput: 'Valor total: $39050',
        description: 'Debe calcular el valor total del portafolio'
      }
    ],
    tags: ['diccionarios', 'items', 'iteracion']
  },
  {
    id: 'ex-2-2-4',
    moduleId: 'module-2',
    lessonId: 'lesson-2-2',
    title: 'Sets Básicos',
    description: 'Crea un set de sectores y usa operaciones de conjuntos.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `# Crea dos sets
sectores_a = {"Bancario", "Energía", "Retail"}
sectores_b = {"Energía", "Tecnología", "Bancario"}
# Encuentra la intersección
comunes = sectores_a.

print(f"Sectores comunes: {comunes}")`,
    solution: `sectores_a = {"Bancario", "Energía", "Retail"}
sectores_b = {"Energía", "Tecnología", "Bancario"}
comunes = sectores_a.intersection(sectores_b)

print(f"Sectores comunes: {comunes}")`,
    hints: [
      'Los sets usan llaves {} pero sin pares clave:valor',
      'Usa .intersection() para encontrar elementos comunes'
    ],
    testCases: [
      {
        expectedOutput: "Sectores comunes: {'Bancario', 'Energía'}",
        description: 'Debe encontrar los sectores comunes'
      }
    ],
    tags: ['sets', 'conjuntos', 'intersection']
  },
  {
    id: 'ex-2-2-5',
    moduleId: 'module-2',
    lessonId: 'lesson-2-2',
    title: 'Diccionario Anidado',
    description: 'Crea un diccionario anidado con información de múltiples acciones.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `# Crea el diccionario anidado
portafolio = {
    "ECOPETROL": {"precio": 2850, "cantidad": 100},
    "Bancolombia": {"precio": 35000, "cantidad": 10}
}
# Calcula el valor de ECOPETROL
valor_eco = portafolio["ECOPETROL"]["precio"] * portafolio["ECOPETROL"]["cantidad"]

print(f"Valor ECOPETROL: \${valor_eco}")`,
    solution: `portafolio = {
    "ECOPETROL": {"precio": 2850, "cantidad": 100},
    "Bancolombia": {"precio": 35000, "cantidad": 10}
}
valor_eco = portafolio["ECOPETROL"]["precio"] * portafolio["ECOPETROL"]["cantidad"]

print(f"Valor ECOPETROL: \${valor_eco}")`,
    hints: [
      'Accede a diccionarios anidados con múltiples []',
      'Multiplica precio por cantidad'
    ],
    testCases: [
      {
        expectedOutput: 'Valor ECOPETROL: $285000',
        description: 'Debe calcular el valor correctamente'
      }
    ],
    tags: ['diccionarios', 'anidados', 'acceso-multiple']
  },

  // Lesson 2.3: Comprensiones
  {
    id: 'ex-2-3-1',
    moduleId: 'module-2',
    lessonId: 'lesson-2-3',
    title: 'List Comprehension Básica',
    description: 'Usa list comprehension para crear una lista de cuadrados.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `numeros = [1, 2, 3, 4, 5]
# Crea una lista de cuadrados usando comprehension
cuadrados = 

print(cuadrados)`,
    solution: `numeros = [1, 2, 3, 4, 5]
cuadrados = [n ** 2 for n in numeros]

print(cuadrados)`,
    hints: [
      'La sintaxis es [expresion for variable in iterable]',
      'Usa n ** 2 para elevar al cuadrado'
    ],
    testCases: [
      {
        expectedOutput: '[1, 4, 9, 16, 25]',
        description: 'Debe crear una lista de cuadrados'
      }
    ],
    tags: ['comprehension', 'listas', 'cuadrados']
  },
  {
    id: 'ex-2-3-2',
    moduleId: 'module-2',
    lessonId: 'lesson-2-3',
    title: 'List Comprehension con Condición',
    description: 'Filtra precios mayores a 3000 usando list comprehension.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `precios = [2500, 3500, 2800, 4000, 2900]
# Filtra precios mayores a 3000
precios_altos = 

print(precios_altos)`,
    solution: `precios = [2500, 3500, 2800, 4000, 2900]
precios_altos = [p for p in precios if p > 3000]

print(precios_altos)`,
    hints: [
      'Agrega "if condicion" al final de la comprehension',
      'La sintaxis es [expresion for variable in iterable if condicion]'
    ],
    testCases: [
      {
        expectedOutput: '[3500, 4000]',
        description: 'Debe filtrar precios mayores a 3000'
      }
    ],
    tags: ['comprehension', 'filtrado', 'condicional']
  },
  {
    id: 'ex-2-3-3',
    moduleId: 'module-2',
    lessonId: 'lesson-2-3',
    title: 'Dict Comprehension',
    description: 'Crea un diccionario usando dict comprehension.',
    difficulty: 'intermediate',
    xpReward: 25,
    starterCode: `acciones = ["ECOPETROL", "Bancolombia", "Grupo Aval"]
precios = [2850, 35000, 1200]
# Crea un diccionario usando comprehension
portafolio = 

print(portafolio)`,
    solution: `acciones = ["ECOPETROL", "Bancolombia", "Grupo Aval"]
precios = [2850, 35000, 1200]
portafolio = {accion: precio for accion, precio in zip(acciones, precios)}

print(portafolio)`,
    hints: [
      'Usa zip() para combinar dos listas',
      'La sintaxis es {clave: valor for variables in iterable}'
    ],
    testCases: [
      {
        expectedOutput: "{'ECOPETROL': 2850, 'Bancolombia': 35000, 'Grupo Aval': 1200}",
        description: 'Debe crear el diccionario correctamente'
      }
    ],
    tags: ['comprehension', 'diccionarios', 'zip']
  },
  {
    id: 'ex-2-3-4',
    moduleId: 'module-2',
    lessonId: 'lesson-2-3',
    title: 'Comprehension con Transformación',
    description: 'Aplica un descuento del 10% a todos los precios usando comprehension.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `precios = [2500, 3000, 2800, 3200]
# Aplica 10% de descuento
precios_descuento = 

print(precios_descuento)`,
    solution: `precios = [2500, 3000, 2800, 3200]
precios_descuento = [p * 0.9 for p in precios]

print(precios_descuento)`,
    hints: [
      'Multiplica cada precio por 0.9 (90%)',
      'Usa la expresión p * 0.9 en la comprehension'
    ],
    testCases: [
      {
        expectedOutput: '[2250.0, 2700.0, 2520.0, 2880.0]',
        description: 'Debe aplicar el descuento correctamente'
      }
    ],
    tags: ['comprehension', 'transformacion', 'descuento']
  },
  {
    id: 'ex-2-3-5',
    moduleId: 'module-2',
    lessonId: 'lesson-2-3',
    title: 'Comprehension Anidada',
    description: 'Crea una matriz 3x3 usando comprehension anidada.',
    difficulty: 'advanced',
    xpReward: 25,
    starterCode: `# Crea una matriz 3x3 con valores i*j
matriz = 

print(matriz)`,
    solution: `matriz = [[i * j for j in range(1, 4)] for i in range(1, 4)]

print(matriz)`,
    hints: [
      'Usa comprehension anidada: [[expresion for j in ...] for i in ...]',
      'Multiplica i * j para cada elemento'
    ],
    testCases: [
      {
        expectedOutput: '[[1, 2, 3], [2, 4, 6], [3, 6, 9]]',
        description: 'Debe crear la matriz correctamente'
      }
    ],
    tags: ['comprehension', 'anidada', 'matriz']
  },

  // Lesson 2.4: Strings y Formateo
  {
    id: 'ex-2-4-1',
    moduleId: 'module-2',
    lessonId: 'lesson-2-4',
    title: 'Métodos de Strings',
    description: 'Usa métodos de strings para manipular texto.',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `accion = "  ecopetrol  "
# Limpia espacios y convierte a mayúsculas
accion_limpia = 

print(accion_limpia)`,
    solution: `accion = "  ecopetrol  "
accion_limpia = accion.strip().upper()

print(accion_limpia)`,
    hints: [
      'Usa .strip() para eliminar espacios',
      'Usa .upper() para convertir a mayúsculas',
      'Puedes encadenar métodos'
    ],
    testCases: [
      {
        expectedOutput: 'ECOPETROL',
        description: 'Debe limpiar y convertir a mayúsculas'
      }
    ],
    tags: ['strings', 'strip', 'upper']
  },
  {
    id: 'ex-2-4-2',
    moduleId: 'module-2',
    lessonId: 'lesson-2-4',
    title: 'Split y Join',
    description: 'Divide un string y únelo de nuevo con un separador diferente.',
    difficulty: 'beginner',
    xpReward: 15,
    starterCode: `fecha = "2024-01-15"
# Divide por guiones
partes = fecha.split("-")
# Une con barras
fecha_nueva = 

print(fecha_nueva)`,
    solution: `fecha = "2024-01-15"
partes = fecha.split("-")
fecha_nueva = "/".join(partes)

print(fecha_nueva)`,
    hints: [
      'Usa .split("-") para dividir por guiones',
      'Usa "/".join(lista) para unir con barras'
    ],
    testCases: [
      {
        expectedOutput: '2024/01/15',
        description: 'Debe convertir el formato de fecha'
      }
    ],
    tags: ['strings', 'split', 'join']
  },
  {
    id: 'ex-2-4-3',
    moduleId: 'module-2',
    lessonId: 'lesson-2-4',
    title: 'F-Strings Avanzados',
    description: 'Usa f-strings con formato numérico.',
    difficulty: 'intermediate',
    xpReward: 15,
    starterCode: `precio = 2850.5678
cantidad = 100
total = precio * cantidad
# Formatea con 2 decimales y separador de miles
mensaje = 

print(mensaje)`,
    solution: `precio = 2850.5678
cantidad = 100
total = precio * cantidad
mensaje = f"Total: \${total:,.2f}"

print(mensaje)`,
    hints: [
      'Usa :,.2f para formato con comas y 2 decimales',
      'La sintaxis es {variable:formato}'
    ],
    testCases: [
      {
        expectedOutput: 'Total: $285,056.78',
        description: 'Debe formatear con separador de miles y 2 decimales'
      }
    ],
    tags: ['f-strings', 'formato', 'numeros']
  },
  {
    id: 'ex-2-4-4',
    moduleId: 'module-2',
    lessonId: 'lesson-2-4',
    title: 'String Replace',
    description: 'Reemplaza texto en un string.',
    difficulty: 'beginner',
    xpReward: 10,
    starterCode: `mensaje = "El precio de la acción es bajo"
# Reemplaza "bajo" por "alto"
mensaje_nuevo = 

print(mensaje_nuevo)`,
    solution: `mensaje = "El precio de la acción es bajo"
mensaje_nuevo = mensaje.replace("bajo", "alto")

print(mensaje_nuevo)`,
    hints: [
      'Usa .replace(viejo, nuevo) para reemplazar texto'
    ],
    testCases: [
      {
        expectedOutput: 'El precio de la acción es alto',
        description: 'Debe reemplazar "bajo" por "alto"'
      }
    ],
    tags: ['strings', 'replace', 'reemplazo']
  },
  {
    id: 'ex-2-4-5',
    moduleId: 'module-2',
    lessonId: 'lesson-2-4',
    title: 'String Formatting Completo',
    description: 'Crea un reporte formateado con múltiples variables.',
    difficulty: 'intermediate',
    xpReward: 20,
    starterCode: `accion = "ECOPETROL"
precio_compra = 2500
precio_actual = 2850
cantidad = 100
ganancia = (precio_actual - precio_compra) * cantidad
porcentaje = (precio_actual - precio_compra) / precio_compra * 100

# Crea el reporte
reporte = f"""
Acción: {accion}
Cantidad: {cantidad}
Precio Compra: \${precio_compra:,.2f}
Precio Actual: \${precio_actual:,.2f}
Ganancia: \${ganancia:,.2f} ({porcentaje:.1f}%)
"""

print(reporte)`,
    solution: `accion = "ECOPETROL"
precio_compra = 2500
precio_actual = 2850
cantidad = 100
ganancia = (precio_actual - precio_compra) * cantidad
porcentaje = (precio_actual - precio_compra) / precio_compra * 100

reporte = f"""
Acción: {accion}
Cantidad: {cantidad}
Precio Compra: \${precio_compra:,.2f}
Precio Actual: \${precio_actual:,.2f}
Ganancia: \${ganancia:,.2f} ({porcentaje:.1f}%)
"""

print(reporte)`,
    hints: [
      'Usa f-strings multilínea con triple comillas """',
      'Usa :,.2f para formato con 2 decimales',
      'Usa :.1f para 1 decimal en el porcentaje'
    ],
    testCases: [
      {
        expectedOutput: '\nAcción: ECOPETROL\nCantidad: 100\nPrecio Compra: $2,500.00\nPrecio Actual: $2,850.00\nGanancia: $35,000.00 (14.0%)\n',
        description: 'Debe crear el reporte formateado correctamente'
      }
    ],
    tags: ['f-strings', 'formato', 'reporte', 'multilinea']
  }
];

// Combine all exercises including Module 3
export const sampleExercises: Exercise[] = [...baseExercises, ...module3Exercises];

