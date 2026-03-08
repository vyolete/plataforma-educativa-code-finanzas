// Sample lesson content for demonstration
// In production, this would come from the backend API

import { module3Lessons } from './module3-lessons';

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  orderIndex: number;
}

export const sampleLessons: Lesson[] = [
  {
    id: '1-1',
    moduleId: '1',
    title: 'Variables y Tipos de Datos',
    orderIndex: 1,
    content: `# Variables y Tipos de Datos en Python

## ¿Qué aprenderás?

- Crear y usar variables en Python
- Entender los tipos de datos básicos: números, strings y booleanos
- Convertir entre diferentes tipos de datos
- Aplicar variables en cálculos financieros simples

## ¿Qué construirás?

Al final de esta lección, podrás crear un programa que calcule el valor de una inversión con interés simple.

**Nivel de dificultad:** Principiante

---

## Introducción

En Python, las **variables** son contenedores que almacenan valores. A diferencia de otros lenguajes, no necesitas declarar el tipo de variable explícitamente - Python lo infiere automáticamente.

Piensa en una variable como una caja etiquetada donde guardas información que puedes usar más tarde.

## Tipos de Datos Básicos

### Números Enteros (int)

Los enteros son números sin decimales:

\`\`\`python
# Cantidad de acciones
acciones_jpm = 100
acciones_bac = 50

# Año de inversión
año = 2024

# Operaciones con enteros
total_acciones = acciones_jpm + acciones_bac  # 150
\`\`\`

### Números Decimales (float)

Los flotantes son números con decimales:

\`\`\`python
# Precios de acciones bancarias
precio_jpm = 150.75
precio_bac = 35.20
precio_c = 50.45

# Tasa de interés
tasa_interes = 0.05  # 5%

# Operaciones con decimales
valor_total = precio_jpm * 10 + precio_bac * 20  # 2211.5
\`\`\`

### Cadenas de Texto (str)

Las cadenas almacenan texto y se definen con comillas simples o dobles:

\`\`\`python
# Información de acciones
ticker = "JPM"
nombre_banco = "JPMorgan Chase"
sector = "Financiero"

# Concatenación de strings
mensaje = "Acción: " + ticker + " - " + nombre_banco
print(mensaje)  # Acción: JPM - JPMorgan Chase

# Formato moderno con f-strings (recomendado)
mensaje = f"Acción: {ticker} - {nombre_banco}"
print(mensaje)
\`\`\`

### Booleanos (bool)

Los valores booleanos representan verdadero o falso:

\`\`\`python
# Estados de inversión
es_rentable = True
tiene_dividendos = False
mercado_abierto = True

# Operaciones lógicas
puede_vender = mercado_abierto and es_rentable  # True
necesita_revision = not tiene_dividendos  # True
\`\`\`

## Asignación de Variables

Python usa el operador \`=\` para asignar valores:

\`\`\`python
# Asignación simple
capital = 10000

# Asignación múltiple (muy útil!)
ticker, precio, cantidad = "JPM", 150.0, 10

# Intercambio de valores (sin variable temporal)
compra, venta = 100, 120
compra, venta = venta, compra  # Ahora compra=120, venta=100
\`\`\`

## Conversión de Tipos

A veces necesitas convertir un tipo de dato a otro:

\`\`\`python
# String a número (útil al leer input del usuario)
precio_str = "150.75"
precio_num = float(precio_str)  # 150.75

# Número a string (útil para concatenar)
cantidad = 100
mensaje = "Tienes " + str(cantidad) + " acciones"

# String a entero
año_str = "2024"
año_num = int(año_str)  # 2024
\`\`\`

## Ejemplo Financiero: Interés Simple

Veamos un ejemplo completo aplicado a finanzas:

\`\`\`python
# Datos de una inversión en acciones bancarias
capital_inicial = 10000.0  # Inversión inicial en dólares
tasa_interes = 0.05  # 5% anual
años = 3

# Cálculo de interés simple: I = C × r × t
interes = capital_inicial * tasa_interes * años
capital_final = capital_inicial + interes

# Mostrar resultados
print(f"Capital inicial: \${capital_inicial:,.2f}")
print(f"Tasa de interés: {tasa_interes * 100}%")
print(f"Período: {años} años")
print(f"Interés ganado: \${interes:,.2f}")
print(f"Capital final: \${capital_final:,.2f}")

# Salida:
# Capital inicial: $10,000.00
# Tasa de interés: 5.0%
# Período: 3 años
# Interés ganado: $1,500.00
# Capital final: $11,500.00
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Cómo crear variables con diferentes tipos de datos  
✓ La diferencia entre int, float, str y bool  
✓ Cómo convertir entre tipos usando int(), float(), str()  
✓ Cómo usar f-strings para formatear texto  

## Puntos Clave

- Las variables no requieren declaración de tipo explícita
- Python infiere el tipo automáticamente según el valor asignado
- Usa nombres descriptivos para tus variables (precio_accion, no x)
- Los tipos básicos son: **int** (enteros), **float** (decimales), **str** (texto), **bool** (verdadero/falso)
- Usa f-strings para formatear texto: \`f"Precio: \${precio}"\`
- Puedes convertir entre tipos con int(), float(), str()
`
  },
  {
    id: '1-2',
    moduleId: '1',
    title: 'Operadores y Expresiones',
    orderIndex: 2,
    content: `# Operadores y Expresiones

## ¿Qué aprenderás?

- Usar operadores aritméticos para cálculos financieros
- Comparar valores con operadores de comparación
- Combinar condiciones con operadores lógicos
- Entender la precedencia de operadores

## ¿Qué construirás?

Crearás un programa que calcula el rendimiento total de una inversión en acciones bancarias, incluyendo ganancias de capital y dividendos.

**Nivel de dificultad:** Principiante

---

## Operadores Aritméticos

Python proporciona operadores para realizar cálculos matemáticos:

\`\`\`python
# Operadores básicos
suma = 100 + 50        # 150
resta = 100 - 50       # 50
multiplicacion = 10 * 5  # 50
division = 100 / 4     # 25.0 (siempre retorna float)

# Operadores especiales
division_entera = 100 // 3  # 33 (descarta decimales)
modulo = 100 % 3      # 1 (resto de la división)
potencia = 2 ** 3     # 8 (2 elevado a 3)
\`\`\`

### Ejemplo Financiero: Valor de Portafolio

\`\`\`python
# Portafolio de acciones bancarias
acciones_jpm = 10
precio_jpm = 150.75

acciones_bac = 20
precio_bac = 35.20

# Calcular valor de cada posición
valor_jpm = acciones_jpm * precio_jpm  # 1507.5
valor_bac = acciones_bac * precio_bac  # 704.0

# Valor total del portafolio
valor_total = valor_jpm + valor_bac  # 2211.5

print(f"Valor JPM: \${valor_jpm:,.2f}")
print(f"Valor BAC: \${valor_bac:,.2f}")
print(f"Valor Total: \${valor_total:,.2f}")
\`\`\`

## Operadores de Comparación

Comparan valores y retornan \`True\` o \`False\`:

\`\`\`python
precio_actual = 150.0
precio_objetivo = 160.0

# Comparaciones
es_igual = precio_actual == precio_objetivo  # False
es_diferente = precio_actual != precio_objetivo  # True
es_mayor = precio_actual > 140  # True
es_menor = precio_actual < 160  # True
mayor_o_igual = precio_actual >= 150  # True
menor_o_igual = precio_actual <= 150  # True
\`\`\`

### Ejemplo: Alertas de Precio

\`\`\`python
# Sistema de alertas para acciones
precio_jpm = 155.0
precio_compra = 150.0
precio_stop_loss = 140.0

# Verificar condiciones
tiene_ganancia = precio_jpm > precio_compra  # True
debe_vender = precio_jpm < precio_stop_loss  # False

print(f"¿Tiene ganancia? {tiene_ganancia}")
print(f"¿Activar stop loss? {debe_vender}")
\`\`\`

## Operadores Lógicos

Combinan expresiones booleanas:

\`\`\`python
# AND: ambas condiciones deben ser True
precio = 155.0
volumen = 1500000

# Comprar si el precio es bueno Y hay suficiente volumen
puede_comprar = precio < 160 and volumen > 1000000  # True

# OR: al menos una condición debe ser True
es_banco_grande = ticker == "JPM" or ticker == "BAC"  # True

# NOT: invierte el valor booleano
mercado_cerrado = False
mercado_abierto = not mercado_cerrado  # True
\`\`\`

### Ejemplo: Estrategia de Inversión

\`\`\`python
# Criterios para invertir en una acción bancaria
precio_accion = 150.0
precio_maximo = 160.0
tiene_dividendos = True
ratio_pe = 12.5
ratio_pe_maximo = 15.0

# Estrategia: comprar si el precio es bueno Y 
# (tiene dividendos O el P/E es bajo)
debe_comprar = (precio_accion < precio_maximo) and \
               (tiene_dividendos or ratio_pe < ratio_pe_maximo)

print(f"¿Comprar acción? {debe_comprar}")  # True
\`\`\`

## Precedencia de Operadores

Python sigue reglas de precedencia matemática (PEMDAS):

1. Paréntesis \`()\`
2. Potencia \`**\`
3. Multiplicación \`*\`, División \`/\`, División entera \`//\`, Módulo \`%\`
4. Suma \`+\`, Resta \`-\`

\`\`\`python
# Sin paréntesis
resultado = 2 + 3 * 4    # 14 (primero 3*4, luego +2)

# Con paréntesis
resultado = (2 + 3) * 4  # 20 (primero 2+3, luego *4)

# Ejemplo financiero
capital = 10000
tasa = 0.05
años = 3

# Incorrecto (sin paréntesis)
interes = capital * tasa + años  # 503.0 (¡error!)

# Correcto (con paréntesis)
interes = capital * tasa * años  # 1500.0
\`\`\`

## Operadores de Asignación Compuesta

Atajos para operaciones comunes:

\`\`\`python
# Forma larga
capital = 10000
capital = capital + 1500  # 11500

# Forma corta (recomendada)
capital = 10000
capital += 1500  # 11500

# Otros operadores compuestos
precio = 100
precio -= 5   # precio = precio - 5 → 95
precio *= 2   # precio = precio * 2 → 190
precio /= 10  # precio = precio / 10 → 19.0
\`\`\`

## Ejemplo Completo: Cálculo de Rendimiento

\`\`\`python
# Análisis de inversión en JPMorgan Chase
ticker = "JPM"
precio_compra = 140.0
precio_venta = 155.0
cantidad = 100
dividendos_por_accion = 4.0

# Cálculo de ganancias
ganancia_capital = (precio_venta - precio_compra) * cantidad
ingresos_dividendos = dividendos_por_accion * cantidad
ganancia_total = ganancia_capital + ingresos_dividendos

# Cálculo de rendimientos porcentuales
inversion_inicial = precio_compra * cantidad
rendimiento_capital = (ganancia_capital / inversion_inicial) * 100
rendimiento_dividendos = (ingresos_dividendos / inversion_inicial) * 100
rendimiento_total = (ganancia_total / inversion_inicial) * 100

# Mostrar resultados
print(f"=== Análisis de Inversión: {ticker} ===")
print(f"Inversión inicial: \${inversion_inicial:,.2f}")
print(f"Ganancia de capital: \${ganancia_capital:,.2f} ({rendimiento_capital:.2f}%)")
print(f"Ingresos por dividendos: \${ingresos_dividendos:,.2f} ({rendimiento_dividendos:.2f}%)")
print(f"Ganancia total: \${ganancia_total:,.2f}")
print(f"Rendimiento total: {rendimiento_total:.2f}%")

# Salida:
# === Análisis de Inversión: JPM ===
# Inversión inicial: $14,000.00
# Ganancia de capital: $1,500.00 (10.71%)
# Ingresos por dividendos: $400.00 (2.86%)
# Ganancia total: $1,900.00
# Rendimiento total: 13.57%
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Los operadores aritméticos básicos (+, -, *, /, //, %, **)  
✓ Los operadores de comparación (==, !=, >, <, >=, <=)  
✓ Los operadores lógicos (and, or, not)  
✓ La precedencia de operadores y el uso de paréntesis  

## Puntos Clave

- Usa operadores aritméticos para cálculos financieros
- Los operadores de comparación retornan True o False
- Combina condiciones con **and** (ambas), **or** (al menos una), **not** (invertir)
- Usa paréntesis para controlar el orden de las operaciones
- Los operadores compuestos (+=, -=, *=, /=) son atajos útiles
- Siempre verifica la precedencia en expresiones complejas
`
  },
  {
    id: '1-3',
    moduleId: '1',
    title: 'Estructuras de Control',
    orderIndex: 3,
    content: `# Estructuras de Control: if, for, while

## ¿Qué aprenderás?

- Tomar decisiones con condicionales (if, elif, else)
- Repetir acciones con bucles (for, while)
- Controlar el flujo con break y continue
- Aplicar estructuras de control en análisis financiero

## ¿Qué construirás?

Crearás un programa que analiza un portafolio de acciones bancarias y genera recomendaciones automáticas de compra/venta.

**Nivel de dificultad:** Principiante

---

## Condicionales: if, elif, else

Los condicionales permiten ejecutar código solo si se cumple una condición:

\`\`\`python
# Estructura básica
precio = 155.0

if precio > 160:
    print("Precio alto - considerar vender")
elif precio > 140:
    print("Precio moderado - mantener")
else:
    print("Precio bajo - considerar comprar")
\`\`\`

### Ejemplo: Sistema de Alertas

\`\`\`python
# Análisis de acción bancaria
ticker = "JPM"
precio_actual = 152.0
precio_compra = 145.0
precio_objetivo = 165.0
stop_loss = 135.0

# Calcular ganancia/pérdida porcentual
cambio_porcentual = ((precio_actual - precio_compra) / precio_compra) * 100

# Sistema de alertas
if precio_actual >= precio_objetivo:
    print(f"🎯 {ticker}: ¡Objetivo alcanzado! Ganancia: {cambio_porcentual:.2f}%")
    print("Recomendación: VENDER")
elif precio_actual <= stop_loss:
    print(f"⚠️ {ticker}: Stop loss activado. Pérdida: {cambio_porcentual:.2f}%")
    print("Recomendación: VENDER INMEDIATAMENTE")
elif cambio_porcentual > 5:
    print(f"✅ {ticker}: Buena ganancia: {cambio_porcentual:.2f}%")
    print("Recomendación: MANTENER")
else:
    print(f"📊 {ticker}: Cambio: {cambio_porcentual:.2f}%")
    print("Recomendación: MANTENER Y MONITOREAR")
\`\`\`

## Operadores Lógicos en Condicionales

Combina múltiples condiciones:

\`\`\`python
# Criterios de inversión
precio = 150.0
volumen = 2000000
tiene_dividendos = True
ratio_pe = 12.0

# Estrategia de compra con múltiples criterios
if precio < 160 and volumen > 1000000:
    if tiene_dividendos or ratio_pe < 15:
        print("✅ Excelente oportunidad de compra")
    else:
        print("⚠️ Revisar fundamentales")
else:
    print("❌ No cumple criterios de compra")
\`\`\`

## Bucle for: Iterar sobre Secuencias

El bucle \`for\` itera sobre elementos de una secuencia:

\`\`\`python
# Iterar sobre una lista de acciones bancarias
acciones = ["JPM", "BAC", "C", "WFC"]

for ticker in acciones:
    print(f"Analizando {ticker}...")

# Iterar sobre un rango de números
for año in range(2020, 2025):
    print(f"Año: {año}")

# Iterar con índice
for i in range(len(acciones)):
    print(f"{i + 1}. {acciones[i]}")
\`\`\`

### Ejemplo: Análisis de Portafolio

\`\`\`python
# Portafolio de acciones bancarias
portafolio = [
    {"ticker": "JPM", "precio": 150.0, "cantidad": 10},
    {"ticker": "BAC", "precio": 35.0, "cantidad": 20},
    {"ticker": "C", "precio": 50.0, "cantidad": 15},
    {"ticker": "WFC", "precio": 45.0, "cantidad": 12}
]

print("=== Análisis de Portafolio ===")
valor_total = 0

for posicion in portafolio:
    ticker = posicion["ticker"]
    precio = posicion["precio"]
    cantidad = posicion["cantidad"]
    valor = precio * cantidad
    valor_total += valor
    
    print(f"{ticker}: {cantidad} acciones × \${precio} = \${valor:,.2f}")

print(f"\nValor total del portafolio: \${valor_total:,.2f}")

# Salida:
# === Análisis de Portafolio ===
# JPM: 10 acciones × $150.0 = $1,500.00
# BAC: 20 acciones × $35.0 = $700.00
# C: 15 acciones × $50.0 = $750.00
# WFC: 12 acciones × $45.0 = $540.00
# 
# Valor total del portafolio: $3,490.00
\`\`\`

## Bucle while: Repetir mientras se cumpla una Condición

El bucle \`while\` se ejecuta mientras la condición sea verdadera:

\`\`\`python
# Simular crecimiento de inversión
capital = 10000
tasa_anual = 0.08  # 8%
objetivo = 15000
años = 0

while capital < objetivo:
    años += 1
    interes = capital * tasa_anual
    capital += interes
    print(f"Año {años}: \${capital:,.2f}")

print(f"\n¡Objetivo alcanzado en {años} años!")

# Salida:
# Año 1: $10,800.00
# Año 2: $11,664.00
# Año 3: $12,597.12
# Año 4: $13,604.89
# Año 5: $14,693.28
# Año 6: $15,868.74
# 
# ¡Objetivo alcanzado en 6 años!
\`\`\`

### Precaución con while

Asegúrate de que la condición eventualmente sea falsa para evitar bucles infinitos:

\`\`\`python
# ❌ MALO: Bucle infinito
# while True:
#     print("Esto nunca termina!")

# ✅ BUENO: Condición que eventualmente será falsa
contador = 0
while contador < 5:
    print(contador)
    contador += 1  # ¡Importante! Actualizar la variable
\`\`\`

## Control de Flujo: break y continue

### break: Salir del bucle

\`\`\`python
# Buscar una acción específica
acciones = ["JPM", "BAC", "C", "WFC", "GS"]
objetivo = "C"

for ticker in acciones:
    print(f"Revisando {ticker}...")
    if ticker == objetivo:
        print(f"¡Encontrado! {ticker}")
        break  # Salir del bucle
    print(f"{ticker} no es el objetivo")

# Salida:
# Revisando JPM...
# JPM no es el objetivo
# Revisando BAC...
# BAC no es el objetivo
# Revisando C...
# ¡Encontrado! C
\`\`\`

### continue: Saltar a la siguiente iteración

\`\`\`python
# Analizar solo acciones con precio > $50
precios = [
    ("JPM", 150.0),
    ("BAC", 35.0),
    ("C", 50.0),
    ("WFC", 45.0),
    ("GS", 380.0)
]

print("Acciones con precio > $50:")
for ticker, precio in precios:
    if precio <= 50:
        continue  # Saltar esta iteración
    print(f"{ticker}: \${precio}")

# Salida:
# Acciones con precio > $50:
# JPM: $150.0
# GS: $380.0
\`\`\`

## Ejemplo Completo: Sistema de Recomendaciones

\`\`\`python
# Sistema de recomendaciones para acciones bancarias
acciones = [
    {"ticker": "JPM", "precio": 155.0, "pe": 10.5, "dividendo": 3.2},
    {"ticker": "BAC", "precio": 32.0, "pe": 9.8, "dividendo": 2.8},
    {"ticker": "C", "precio": 52.0, "pe": 8.2, "dividendo": 4.1},
    {"ticker": "WFC", "precio": 48.0, "pe": 11.2, "dividendo": 3.5},
]

print("=== Sistema de Recomendaciones ===\n")

# Criterios de inversión
PE_MAXIMO = 10.0
DIVIDENDO_MINIMO = 3.0

recomendaciones_compra = []

for accion in acciones:
    ticker = accion["ticker"]
    precio = accion["precio"]
    pe = accion["pe"]
    dividendo = accion["dividendo"]
    
    print(f"Analizando {ticker}:")
    print(f"  Precio: \${precio}")
    print(f"  P/E: {pe}")
    print(f"  Dividendo: {dividendo}%")
    
    # Evaluar criterios
    if pe <= PE_MAXIMO and dividendo >= DIVIDENDO_MINIMO:
        print(f"  ✅ RECOMENDACIÓN: COMPRAR")
        recomendaciones_compra.append(ticker)
    elif pe <= PE_MAXIMO:
        print(f"  ⚠️ RECOMENDACIÓN: CONSIDERAR (bajo P/E)")
    elif dividendo >= DIVIDENDO_MINIMO:
        print(f"  ⚠️ RECOMENDACIÓN: CONSIDERAR (buen dividendo)")
    else:
        print(f"  ❌ RECOMENDACIÓN: EVITAR")
    
    print()

# Resumen
print(f"=== Resumen ===")
print(f"Acciones recomendadas para compra: {len(recomendaciones_compra)}")
if recomendaciones_compra:
    print(f"Tickers: {', '.join(recomendaciones_compra)}")
else:
    print("No hay recomendaciones de compra en este momento")
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Cómo usar if, elif, else para tomar decisiones  
✓ La diferencia entre for (iterar secuencias) y while (repetir mientras condición)  
✓ Cuándo usar break (salir del bucle) y continue (saltar iteración)  
✓ Cómo combinar condicionales y bucles  

## Puntos Clave

- **if/elif/else**: Ejecuta código basado en condiciones
- **for**: Itera sobre secuencias (listas, rangos, strings)
- **while**: Repite mientras la condición sea True (¡cuidado con bucles infinitos!)
- **break**: Sale completamente del bucle
- **continue**: Salta a la siguiente iteración
- Indentación (espacios) es crucial en Python para definir bloques de código
- Combina estructuras de control para crear lógica compleja
`
  },
  {
    id: '1-4',
    moduleId: '1',
    title: 'Funciones Básicas',
    orderIndex: 4,
    content: `# Funciones Básicas en Python

## ¿Qué aprenderás?

- Definir y llamar funciones
- Usar parámetros y argumentos
- Retornar valores con return
- Entender el alcance de variables (scope)
- Crear funciones lambda

## ¿Qué construirás?

Crearás una biblioteca de funciones reutilizables para análisis financiero que podrás usar en múltiples proyectos.

**Nivel de dificultad:** Principiante

---

## ¿Por qué usar Funciones?

Las funciones permiten:
- **Reutilizar código**: Escribe una vez, usa muchas veces
- **Organizar código**: Divide problemas complejos en partes pequeñas
- **Facilitar mantenimiento**: Cambia en un solo lugar
- **Mejorar legibilidad**: Nombres descriptivos explican qué hace el código

## Definir una Función

Usa la palabra clave \`def\`:

\`\`\`python
# Función simple sin parámetros
def saludar():
    print("¡Hola, inversor!")

# Llamar la función
saludar()  # ¡Hola, inversor!

# Función con parámetros
def saludar_persona(nombre):
    print(f"¡Hola, {nombre}!")

saludar_persona("Ana")  # ¡Hola, Ana!
saludar_persona("Carlos")  # ¡Hola, Carlos!
\`\`\`

## Parámetros y Argumentos

\`\`\`python
# Función con múltiples parámetros
def calcular_valor_posicion(precio, cantidad):
    valor = precio * cantidad
    print(f"Valor de la posición: \${valor:,.2f}")

# Llamar con argumentos posicionales
calcular_valor_posicion(150.0, 10)  # Valor de la posición: $1,500.00

# Llamar con argumentos nombrados (más claro)
calcular_valor_posicion(precio=150.0, cantidad=10)

# Parámetros con valores por defecto
def calcular_interes(capital, tasa=0.05, años=1):
    interes = capital * tasa * años
    return interes

# Usar valor por defecto
interes1 = calcular_interes(10000)  # usa tasa=0.05, años=1

# Sobrescribir valores por defecto
interes2 = calcular_interes(10000, tasa=0.08, años=3)
\`\`\`

## Retornar Valores con return

Las funciones pueden retornar valores para usarlos después:

\`\`\`python
# Función que retorna un valor
def calcular_rendimiento(precio_compra, precio_venta):
    ganancia = precio_venta - precio_compra
    rendimiento = (ganancia / precio_compra) * 100
    return rendimiento

# Usar el valor retornado
rendimiento_jpm = calcular_rendimiento(140.0, 155.0)
print(f"Rendimiento JPM: {rendimiento_jpm:.2f}%")  # 10.71%

# Retornar múltiples valores (tupla)
def analizar_inversion(precio_compra, precio_venta, dividendos):
    ganancia_capital = precio_venta - precio_compra
    ganancia_total = ganancia_capital + dividendos
    rendimiento = (ganancia_total / precio_compra) * 100
    return ganancia_capital, ganancia_total, rendimiento

# Desempaquetar valores retornados
gan_cap, gan_tot, rend = analizar_inversion(100.0, 120.0, 5.0)
print(f"Ganancia capital: \${gan_cap}")
print(f"Ganancia total: \${gan_tot}")
print(f"Rendimiento: {rend}%")
\`\`\`

## Ejemplo: Biblioteca de Funciones Financieras

\`\`\`python
# Funciones reutilizables para análisis financiero

def calcular_valor_portafolio(posiciones):
    """
    Calcula el valor total de un portafolio.
    
    Args:
        posiciones: Lista de tuplas (ticker, precio, cantidad)
    
    Returns:
        Valor total del portafolio
    """
    valor_total = 0
    for ticker, precio, cantidad in posiciones:
        valor_total += precio * cantidad
    return valor_total

def calcular_rendimiento_porcentual(precio_inicial, precio_final):
    """Calcula el rendimiento porcentual de una inversión."""
    return ((precio_final - precio_inicial) / precio_inicial) * 100

def clasificar_riesgo(volatilidad):
    """
    Clasifica el riesgo basado en la volatilidad.
    
    Args:
        volatilidad: Porcentaje de volatilidad
    
    Returns:
        Clasificación: 'Bajo', 'Medio', o 'Alto'
    """
    if volatilidad < 15:
        return "Bajo"
    elif volatilidad < 25:
        return "Medio"
    else:
        return "Alto"

def recomendar_accion(precio, pe_ratio, dividendo):
    """
    Genera recomendación de inversión.
    
    Returns:
        'COMPRAR', 'MANTENER', o 'VENDER'
    """
    if pe_ratio < 10 and dividendo > 3:
        return "COMPRAR"
    elif pe_ratio > 20 or dividendo < 2:
        return "VENDER"
    else:
        return "MANTENER"

# Usar las funciones
portafolio = [
    ("JPM", 150.0, 10),
    ("BAC", 35.0, 20),
    ("C", 50.0, 15)
]

valor = calcular_valor_portafolio(portafolio)
print(f"Valor del portafolio: \${valor:,.2f}")

rendimiento = calcular_rendimiento_porcentual(140.0, 155.0)
print(f"Rendimiento: {rendimiento:.2f}%")

riesgo = clasificar_riesgo(18.5)
print(f"Nivel de riesgo: {riesgo}")

recomendacion = recomendar_accion(150.0, 9.5, 3.5)
print(f"Recomendación: {recomendacion}")
\`\`\`

## Alcance de Variables (Scope)

Las variables tienen diferentes alcances:

\`\`\`python
# Variable global
tasa_impuesto = 0.15

def calcular_ganancia_neta(ganancia_bruta):
    # Variable local (solo existe dentro de la función)
    impuesto = ganancia_bruta * tasa_impuesto
    ganancia_neta = ganancia_bruta - impuesto
    return ganancia_neta

ganancia = calcular_ganancia_neta(1000)
print(f"Ganancia neta: \${ganancia}")  # $850.0

# print(impuesto)  # ❌ Error: impuesto no existe fuera de la función

# Modificar variable global (no recomendado)
def cambiar_tasa():
    global tasa_impuesto  # Declarar que usaremos la variable global
    tasa_impuesto = 0.20

cambiar_tasa()
print(tasa_impuesto)  # 0.20
\`\`\`

## Funciones Lambda (Anónimas)

Funciones pequeñas de una sola línea:

\`\`\`python
# Función normal
def cuadrado(x):
    return x ** 2

# Función lambda equivalente
cuadrado_lambda = lambda x: x ** 2

print(cuadrado(5))  # 25
print(cuadrado_lambda(5))  # 25

# Lambdas con múltiples parámetros
calcular_valor = lambda precio, cantidad: precio * cantidad
print(calcular_valor(150.0, 10))  # 1500.0

# Uso común: con funciones de orden superior
precios = [150.0, 35.0, 50.0, 45.0]

# Ordenar de mayor a menor
precios_ordenados = sorted(precios, reverse=True)
print(precios_ordenados)  # [150.0, 50.0, 45.0, 35.0]

# Filtrar precios > 40
precios_altos = list(filter(lambda p: p > 40, precios))
print(precios_altos)  # [150.0, 50.0, 45.0]

# Aplicar descuento del 10% a todos
precios_descuento = list(map(lambda p: p * 0.9, precios))
print(precios_descuento)  # [135.0, 31.5, 45.0, 40.5]
\`\`\`

## Documentación de Funciones (Docstrings)

Documenta tus funciones con docstrings:

\`\`\`python
def calcular_roi(inversion_inicial, valor_final, años):
    """
    Calcula el Retorno sobre la Inversión (ROI) anualizado.
    
    Args:
        inversion_inicial (float): Monto invertido inicialmente
        valor_final (float): Valor final de la inversión
        años (int): Número de años de la inversión
    
    Returns:
        float: ROI anualizado en porcentaje
    
    Example:
        >>> calcular_roi(10000, 15000, 3)
        14.47
    """
    roi_total = ((valor_final - inversion_inicial) / inversion_inicial) * 100
    roi_anualizado = roi_total / años
    return roi_anualizado

# Ver documentación
print(calcular_roi.__doc__)
\`\`\`

## Ejemplo Completo: Calculadora de Inversiones

\`\`\`python
def calcular_interes_simple(capital, tasa, años):
    """Calcula interés simple."""
    return capital * tasa * años

def calcular_interes_compuesto(capital, tasa, años):
    """Calcula interés compuesto."""
    return capital * ((1 + tasa) ** años) - capital

def comparar_inversiones(capital, tasa, años):
    """
    Compara interés simple vs compuesto.
    
    Returns:
        Diccionario con resultados de ambos métodos
    """
    interes_simple = calcular_interes_simple(capital, tasa, años)
    interes_compuesto = calcular_interes_compuesto(capital, tasa, años)
    
    return {
        "capital_inicial": capital,
        "tasa": tasa,
        "años": años,
        "interes_simple": interes_simple,
        "capital_final_simple": capital + interes_simple,
        "interes_compuesto": interes_compuesto,
        "capital_final_compuesto": capital + interes_compuesto,
        "diferencia": interes_compuesto - interes_simple
    }

def mostrar_resultados(resultados):
    """Muestra los resultados de forma legible."""
    print("=== Comparación de Inversiones ===")
    print(f"Capital inicial: \${resultados['capital_inicial']:,.2f}")
    print(f"Tasa de interés: {resultados['tasa'] * 100}%")
    print(f"Período: {resultados['años']} años")
    print()
    print("Interés Simple:")
    print(f"  Interés ganado: \${resultados['interes_simple']:,.2f}")
    print(f"  Capital final: \${resultados['capital_final_simple']:,.2f}")
    print()
    print("Interés Compuesto:")
    print(f"  Interés ganado: \${resultados['interes_compuesto']:,.2f}")
    print(f"  Capital final: \${resultados['capital_final_compuesto']:,.2f}")
    print()
    print(f"Diferencia: \${resultados['diferencia']:,.2f}")

# Usar las funciones
resultados = comparar_inversiones(10000, 0.08, 5)
mostrar_resultados(resultados)

# Salida:
# === Comparación de Inversiones ===
# Capital inicial: $10,000.00
# Tasa de interés: 8.0%
# Período: 5 años
# 
# Interés Simple:
#   Interés ganado: $4,000.00
#   Capital final: $14,000.00
# 
# Interés Compuesto:
#   Interés ganado: $4,693.28
#   Capital final: $14,693.28
# 
# Diferencia: $693.28
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Cómo definir funciones con def  
✓ La diferencia entre parámetros y argumentos  
✓ Cómo retornar valores con return  
✓ El concepto de alcance de variables (local vs global)  
✓ Cuándo usar funciones lambda  

## Puntos Clave

- **def nombre_funcion(parametros):** Define una función
- **return valor**: Retorna un valor de la función
- Usa **docstrings** para documentar tus funciones
- Las variables locales solo existen dentro de la función
- Los parámetros pueden tener **valores por defecto**
- Las **funciones lambda** son útiles para operaciones simples
- Divide código complejo en funciones pequeñas y reutilizables
- Usa nombres descriptivos para funciones y parámetros
`
  },
  {
    id: '2-1',
    moduleId: '2',
    title: 'Listas y Tuplas',
    orderIndex: 1,
    content: `# Listas y Tuplas

## ¿Qué aprenderás?

- Crear y manipular listas en Python
- Usar indexing y slicing para acceder a elementos
- Aplicar métodos de listas (append, extend, remove, sort)
- Entender tuplas y su inmutabilidad
- Usar listas y tuplas en análisis financiero

## ¿Qué construirás?

Crearás un sistema de gestión de portafolio que almacena y analiza múltiples acciones bancarias usando listas y tuplas.

**Nivel de dificultad:** Principiante

---

## Listas: Colecciones Ordenadas y Modificables

Las **listas** son una de las estructuras de datos más importantes en Python. Permiten almacenar múltiples valores en una sola variable.

### Crear Listas

\`\`\`python
# Lista vacía
portafolio = []

# Lista con valores iniciales
precios_jpm = [145.0, 148.5, 150.0, 152.3, 155.0]
acciones_bancarias = ["JPM", "BAC", "C", "WFC"]
datos_mixtos = ["JPM", 150.0, 1000, True]

# Lista de listas (matriz)
portafolio_completo = [
    ["JPM", 150.0, 10],
    ["BAC", 35.0, 20],
    ["C", 50.0, 15]
]
\`\`\`

### Indexing: Acceder a Elementos

Los índices en Python comienzan en 0:

\`\`\`python
acciones = ["JPM", "BAC", "C", "WFC", "GS"]

# Acceso por índice positivo
primera = acciones[0]    # "JPM"
segunda = acciones[1]    # "BAC"
tercera = acciones[2]    # "C"

# Acceso por índice negativo (desde el final)
ultima = acciones[-1]    # "GS"
penultima = acciones[-2] # "WFC"

# Longitud de la lista
cantidad = len(acciones)  # 5
\`\`\`

### Slicing: Extraer Sublistas

El slicing permite obtener porciones de una lista:

\`\`\`python
precios = [100, 105, 102, 108, 110, 115, 112, 118]

# Sintaxis: lista[inicio:fin:paso]
primeros_tres = precios[0:3]    # [100, 105, 102]
desde_cuarto = precios[3:]      # [108, 110, 115, 112, 118]
hasta_quinto = precios[:5]      # [100, 105, 102, 108, 110]
ultimos_tres = precios[-3:]     # [115, 112, 118]

# Con paso
cada_dos = precios[::2]         # [100, 102, 110, 112]
invertida = precios[::-1]       # [118, 112, 115, 110, 108, 102, 105, 100]
\`\`\`

## Métodos de Listas

### Agregar Elementos

\`\`\`python
portafolio = ["JPM", "BAC"]

# append: agregar al final
portafolio.append("C")
print(portafolio)  # ["JPM", "BAC", "C"]

# insert: agregar en posición específica
portafolio.insert(1, "WFC")
print(portafolio)  # ["JPM", "WFC", "BAC", "C"]

# extend: agregar múltiples elementos
portafolio.extend(["GS", "MS"])
print(portafolio)  # ["JPM", "WFC", "BAC", "C", "GS", "MS"]
\`\`\`

### Eliminar Elementos

\`\`\`python
acciones = ["JPM", "BAC", "C", "WFC", "GS"]

# remove: eliminar por valor
acciones.remove("C")
print(acciones)  # ["JPM", "BAC", "WFC", "GS"]

# pop: eliminar y retornar por índice
ultima = acciones.pop()      # "GS"
primera = acciones.pop(0)    # "JPM"
print(acciones)  # ["BAC", "WFC"]

# del: eliminar por índice
del acciones[0]
print(acciones)  # ["WFC"]

# clear: vaciar la lista
acciones.clear()
print(acciones)  # []
\`\`\`

### Ordenar y Modificar

\`\`\`python
precios = [150.0, 35.0, 50.0, 45.0, 380.0]

# sort: ordenar in-place (modifica la lista original)
precios.sort()
print(precios)  # [35.0, 45.0, 50.0, 150.0, 380.0]

precios.sort(reverse=True)
print(precios)  # [380.0, 150.0, 50.0, 45.0, 35.0]

# sorted: retorna nueva lista ordenada (no modifica original)
precios_originales = [150.0, 35.0, 50.0]
precios_ordenados = sorted(precios_originales)
print(precios_originales)  # [150.0, 35.0, 50.0]
print(precios_ordenados)   # [35.0, 50.0, 150.0]

# reverse: invertir orden
acciones = ["JPM", "BAC", "C"]
acciones.reverse()
print(acciones)  # ["C", "BAC", "JPM"]
\`\`\`

## Ejemplo Financiero: Análisis de Precios Históricos

\`\`\`python
# Precios históricos de JPMorgan (últimos 10 días)
precios_jpm = [145.0, 148.5, 150.0, 147.5, 152.0, 
               155.0, 153.5, 157.0, 156.0, 160.0]

# Calcular estadísticas básicas
precio_minimo = min(precios_jpm)
precio_maximo = max(precios_jpm)
precio_promedio = sum(precios_jpm) / len(precios_jpm)

print(f"Análisis de JPM (últimos 10 días)")
print(f"Precio mínimo: \${precio_minimo}")
print(f"Precio máximo: \${precio_maximo}")
print(f"Precio promedio: \${precio_promedio:.2f}")

# Calcular rendimiento diario
rendimientos = []
for i in range(1, len(precios_jpm)):
    rendimiento = ((precios_jpm[i] - precios_jpm[i-1]) / precios_jpm[i-1]) * 100
    rendimientos.append(rendimiento)

print(f"\nRendimientos diarios:")
for i, rend in enumerate(rendimientos, 1):
    print(f"Día {i}: {rend:+.2f}%")

# Rendimiento total
rendimiento_total = ((precios_jpm[-1] - precios_jpm[0]) / precios_jpm[0]) * 100
print(f"\nRendimiento total: {rendimiento_total:+.2f}%")
\`\`\`

## Tuplas: Colecciones Inmutables

Las **tuplas** son similares a las listas, pero **no se pueden modificar** después de crearlas.

### Crear Tuplas

\`\`\`python
# Tupla con paréntesis
coordenadas = (10.5, 20.3)
datos_accion = ("JPM", 150.0, 1000)

# Tupla sin paréntesis (también válido)
punto = 5, 10

# Tupla de un elemento (requiere coma)
singleton = (42,)

# Tupla vacía
vacia = ()
\`\`\`

### Acceder a Elementos de Tuplas

\`\`\`python
datos_accion = ("JPM", 150.0, 1000, True)

# Indexing (igual que listas)
ticker = datos_accion[0]    # "JPM"
precio = datos_accion[1]    # 150.0
volumen = datos_accion[2]   # 1000

# Slicing (igual que listas)
primeros_dos = datos_accion[:2]  # ("JPM", 150.0)

# Desempaquetado (muy útil!)
ticker, precio, volumen, activo = datos_accion
print(f"{ticker}: \${precio} (Volumen: {volumen})")
\`\`\`

### ¿Por qué usar Tuplas?

1. **Inmutabilidad**: Garantiza que los datos no cambien accidentalmente
2. **Rendimiento**: Más rápidas que las listas
3. **Claves de diccionario**: Pueden usarse como keys (las listas no)
4. **Retorno múltiple**: Ideales para retornar múltiples valores de funciones

\`\`\`python
# Tuplas como datos inmutables
ACCIONES_BANCARIAS = ("JPM", "BAC", "C", "WFC")  # Constante

# Intentar modificar causa error
# ACCIONES_BANCARIAS[0] = "GS"  # ❌ TypeError

# Tuplas para retornar múltiples valores
def analizar_accion(precio_compra, precio_actual):
    ganancia = precio_actual - precio_compra
    rendimiento = (ganancia / precio_compra) * 100
    return ganancia, rendimiento  # Retorna tupla

gan, rend = analizar_accion(140.0, 155.0)
print(f"Ganancia: \${gan}, Rendimiento: {rend:.2f}%")
\`\`\`

## Ejemplo Completo: Sistema de Gestión de Portafolio

\`\`\`python
# Portafolio usando lista de tuplas
# Cada tupla: (ticker, precio_compra, cantidad, precio_actual)
portafolio = [
    ("JPM", 140.0, 10, 155.0),
    ("BAC", 30.0, 20, 35.0),
    ("C", 45.0, 15, 50.0),
    ("WFC", 40.0, 12, 45.0)
]

print("=== Análisis de Portafolio ===\n")

# Analizar cada posición
valor_total_invertido = 0
valor_total_actual = 0
ganancias_totales = 0

for ticker, precio_compra, cantidad, precio_actual in portafolio:
    # Calcular valores
    inversion = precio_compra * cantidad
    valor_actual = precio_actual * cantidad
    ganancia = valor_actual - inversion
    rendimiento = (ganancia / inversion) * 100
    
    # Acumular totales
    valor_total_invertido += inversion
    valor_total_actual += valor_actual
    ganancias_totales += ganancia
    
    # Mostrar análisis individual
    print(f"{ticker}:")
    print(f"  Inversión: \${inversion:,.2f}")
    print(f"  Valor actual: \${valor_actual:,.2f}")
    print(f"  Ganancia: \${ganancia:+,.2f}")
    print(f"  Rendimiento: {rendimiento:+.2f}%")
    print()

# Resumen general
rendimiento_total = (ganancias_totales / valor_total_invertido) * 100

print("=== Resumen General ===")
print(f"Inversión total: \${valor_total_invertido:,.2f}")
print(f"Valor actual: \${valor_total_actual:,.2f}")
print(f"Ganancias totales: \${ganancias_totales:+,.2f}")
print(f"Rendimiento total: {rendimiento_total:+.2f}%")

# Encontrar mejor y peor inversión
mejor_rendimiento = -float('inf')
peor_rendimiento = float('inf')
mejor_accion = ""
peor_accion = ""

for ticker, precio_compra, cantidad, precio_actual in portafolio:
    rendimiento = ((precio_actual - precio_compra) / precio_compra) * 100
    
    if rendimiento > mejor_rendimiento:
        mejor_rendimiento = rendimiento
        mejor_accion = ticker
    
    if rendimiento < peor_rendimiento:
        peor_rendimiento = rendimiento
        peor_accion = ticker

print(f"\nMejor inversión: {mejor_accion} ({mejor_rendimiento:+.2f}%)")
print(f"Peor inversión: {peor_accion} ({peor_rendimiento:+.2f}%)")
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Cómo crear y modificar listas  
✓ Indexing (positivo y negativo) y slicing  
✓ Métodos de listas: append, extend, remove, pop, sort  
✓ La diferencia entre listas (mutables) y tuplas (inmutables)  
✓ Cuándo usar listas vs tuplas  

## Puntos Clave

- **Listas**: Colecciones ordenadas y **modificables** - usa corchetes \`[]\`
- **Tuplas**: Colecciones ordenadas e **inmutables** - usa paréntesis \`()\`
- **Indexing**: Accede a elementos individuales (índice comienza en 0)
- **Slicing**: Extrae sublistas con \`lista[inicio:fin:paso]\`
- **Métodos útiles**: append(), extend(), remove(), pop(), sort(), reverse()
- Usa **tuplas** para datos que no deben cambiar
- Usa **listas** para colecciones que necesitas modificar
- El **desempaquetado** de tuplas es muy útil: \`a, b, c = (1, 2, 3)\`
`
  },
  {
    id: '2-2',
    moduleId: '2',
    title: 'Diccionarios y Sets',
    orderIndex: 2,
    content: `# Diccionarios y Sets

## ¿Qué aprenderás?

- Crear y manipular diccionarios con keys y values
- Usar métodos de diccionarios para acceder y modificar datos
- Entender sets y operaciones de conjuntos
- Aplicar diccionarios y sets en análisis financiero

## ¿Qué construirás?

Crearás un sistema de análisis de acciones que almacena información detallada usando diccionarios y realiza comparaciones usando sets.

**Nivel de dificultad:** Principiante

---

## Diccionarios: Pares Clave-Valor

Los **diccionarios** almacenan datos en pares clave-valor, permitiendo acceso rápido por clave.

### Crear Diccionarios

\`\`\`python
# Diccionario vacío
portafolio = {}

# Diccionario con datos iniciales
accion_jpm = {
    "ticker": "JPM",
    "nombre": "JPMorgan Chase",
    "precio": 150.0,
    "cantidad": 10,
    "sector": "Financiero"
}

# Diccionario con diferentes tipos de valores
datos_mercado = {
    "fecha": "2024-01-15",
    "abierto": True,
    "indices": ["S&P500", "NASDAQ", "DOW"],
    "volumen_total": 5000000
}
\`\`\`

### Acceder a Valores

\`\`\`python
accion = {
    "ticker": "JPM",
    "precio": 150.0,
    "cantidad": 10
}

# Acceso con corchetes
ticker = accion["ticker"]    # "JPM"
precio = accion["precio"]    # 150.0

# Acceso con get (más seguro)
cantidad = accion.get("cantidad")        # 10
dividendo = accion.get("dividendo", 0)   # 0 (valor por defecto)

# Intentar acceder a clave inexistente
# error = accion["dividendo"]  # ❌ KeyError
seguro = accion.get("dividendo")  # None (no causa error)
\`\`\`

### Modificar Diccionarios

\`\`\`python
accion = {"ticker": "JPM", "precio": 150.0}

# Agregar o modificar valores
accion["cantidad"] = 10           # Agregar nueva clave
accion["precio"] = 155.0          # Modificar valor existente

# Actualizar múltiples valores
accion.update({
    "sector": "Financiero",
    "dividendo": 4.0
})

print(accion)
# {'ticker': 'JPM', 'precio': 155.0, 'cantidad': 10, 
#  'sector': 'Financiero', 'dividendo': 4.0}
\`\`\`

## Métodos de Diccionarios

### Keys, Values e Items

\`\`\`python
accion = {
    "ticker": "JPM",
    "precio": 150.0,
    "cantidad": 10,
    "sector": "Financiero"
}

# Obtener todas las claves
claves = accion.keys()
print(list(claves))  # ['ticker', 'precio', 'cantidad', 'sector']

# Obtener todos los valores
valores = accion.values()
print(list(valores))  # ['JPM', 150.0, 10, 'Financiero']

# Obtener pares clave-valor
items = accion.items()
print(list(items))
# [('ticker', 'JPM'), ('precio', 150.0), ('cantidad', 10), ('sector', 'Financiero')]

# Iterar sobre diccionario
for clave, valor in accion.items():
    print(f"{clave}: {valor}")
\`\`\`

### Eliminar Elementos

\`\`\`python
accion = {"ticker": "JPM", "precio": 150.0, "cantidad": 10}

# pop: eliminar y retornar valor
precio = accion.pop("precio")  # 150.0
print(accion)  # {'ticker': 'JPM', 'cantidad': 10}

# popitem: eliminar y retornar último par (Python 3.7+)
ultimo = accion.popitem()  # ('cantidad', 10)

# del: eliminar por clave
accion["sector"] = "Financiero"
del accion["sector"]

# clear: vaciar diccionario
accion.clear()
print(accion)  # {}
\`\`\`

## Ejemplo Financiero: Base de Datos de Acciones

\`\`\`python
# Base de datos de acciones bancarias
acciones_db = {
    "JPM": {
        "nombre": "JPMorgan Chase",
        "precio": 150.0,
        "pe_ratio": 10.5,
        "dividendo": 3.2,
        "sector": "Banca"
    },
    "BAC": {
        "nombre": "Bank of America",
        "precio": 35.0,
        "pe_ratio": 9.8,
        "dividendo": 2.8,
        "sector": "Banca"
    },
    "C": {
        "nombre": "Citigroup",
        "precio": 50.0,
        "pe_ratio": 8.2,
        "dividendo": 4.1,
        "sector": "Banca"
    }
}

# Buscar información de una acción
ticker_buscar = "JPM"
if ticker_buscar in acciones_db:
    info = acciones_db[ticker_buscar]
    print(f"=== {info['nombre']} ({ticker_buscar}) ===")
    print(f"Precio: \${info['precio']}")
    print(f"P/E Ratio: {info['pe_ratio']}")
    print(f"Dividendo: {info['dividendo']}%")

# Filtrar acciones por criterio
print("\nAcciones con dividendo > 3%:")
for ticker, info in acciones_db.items():
    if info["dividendo"] > 3.0:
        print(f"{ticker}: {info['dividendo']}%")

# Calcular promedio de P/E ratio
pe_ratios = [info["pe_ratio"] for info in acciones_db.values()]
pe_promedio = sum(pe_ratios) / len(pe_ratios)
print(f"\nP/E Ratio promedio del sector: {pe_promedio:.2f}")
\`\`\`

## Sets: Conjuntos Únicos

Los **sets** son colecciones **no ordenadas** de elementos **únicos**.

### Crear Sets

\`\`\`python
# Set vacío (debe usar set(), no {})
vacio = set()

# Set con valores iniciales
sectores = {"Banca", "Tecnología", "Energía"}
tickers = {"JPM", "BAC", "C", "JPM"}  # Duplicados se eliminan automáticamente
print(tickers)  # {'JPM', 'BAC', 'C'}

# Convertir lista a set (elimina duplicados)
precios = [100, 105, 100, 110, 105, 115]
precios_unicos = set(precios)
print(precios_unicos)  # {100, 105, 110, 115}
\`\`\`

### Operaciones con Sets

\`\`\`python
# Agregar elementos
sectores = {"Banca", "Tecnología"}
sectores.add("Energía")
print(sectores)  # {'Banca', 'Tecnología', 'Energía'}

# Eliminar elementos
sectores.remove("Energía")  # Error si no existe
sectores.discard("Salud")   # No causa error si no existe

# Verificar pertenencia
tiene_banca = "Banca" in sectores  # True
tiene_salud = "Salud" in sectores  # False
\`\`\`

## Operaciones de Conjuntos

\`\`\`python
# Portafolios de dos inversores
portafolio_ana = {"JPM", "BAC", "C", "AAPL", "MSFT"}
portafolio_carlos = {"JPM", "WFC", "AAPL", "GOOGL"}

# Unión: acciones en cualquiera de los dos portafolios
union = portafolio_ana | portafolio_carlos
# o: union = portafolio_ana.union(portafolio_carlos)
print(f"Unión: {union}")
# {'JPM', 'BAC', 'C', 'AAPL', 'MSFT', 'WFC', 'GOOGL'}

# Intersección: acciones en ambos portafolios
interseccion = portafolio_ana & portafolio_carlos
# o: interseccion = portafolio_ana.intersection(portafolio_carlos)
print(f"Intersección: {interseccion}")
# {'JPM', 'AAPL'}

# Diferencia: acciones solo en portafolio de Ana
diferencia = portafolio_ana - portafolio_carlos
# o: diferencia = portafolio_ana.difference(portafolio_carlos)
print(f"Solo Ana: {diferencia}")
# {'BAC', 'C', 'MSFT'}

# Diferencia simétrica: acciones en uno pero no en ambos
dif_simetrica = portafolio_ana ^ portafolio_carlos
# o: dif_simetrica = portafolio_ana.symmetric_difference(portafolio_carlos)
print(f"Diferencia simétrica: {dif_simetrica}")
# {'BAC', 'C', 'MSFT', 'WFC', 'GOOGL'}
\`\`\`

## Ejemplo Completo: Análisis de Portafolios

\`\`\`python
# Portafolios de múltiples inversores
portafolios = {
    "Ana": {
        "acciones": {"JPM", "BAC", "C", "AAPL"},
        "capital": 50000
    },
    "Carlos": {
        "acciones": {"JPM", "WFC", "AAPL", "GOOGL"},
        "capital": 75000
    },
    "María": {
        "acciones": {"BAC", "C", "WFC", "MSFT"},
        "capital": 60000
    }
}

# Información de precios
precios = {
    "JPM": 150.0,
    "BAC": 35.0,
    "C": 50.0,
    "WFC": 45.0,
    "AAPL": 180.0,
    "GOOGL": 140.0,
    "MSFT": 380.0
}

print("=== Análisis de Portafolios ===\n")

# Analizar cada portafolio
for inversor, datos in portafolios.items():
    acciones = datos["acciones"]
    capital = datos["capital"]
    
    print(f"{inversor}:")
    print(f"  Capital: \${capital:,}")
    print(f"  Acciones: {', '.join(sorted(acciones))}")
    print(f"  Cantidad de acciones: {len(acciones)}")
    print()

# Encontrar acciones populares
todas_acciones = set()
for datos in portafolios.values():
    todas_acciones = todas_acciones | datos["acciones"]

print(f"Total de acciones únicas: {len(todas_acciones)}")
print(f"Acciones: {', '.join(sorted(todas_acciones))}\n")

# Encontrar acciones en común
acciones_comunes = portafolios["Ana"]["acciones"]
for inversor, datos in portafolios.items():
    if inversor != "Ana":
        acciones_comunes = acciones_comunes & datos["acciones"]

print(f"Acciones en todos los portafolios: {acciones_comunes or 'Ninguna'}\n")

# Acciones solo en un portafolio
print("Acciones exclusivas:")
for inversor, datos in portafolios.items():
    acciones_propias = datos["acciones"]
    
    # Acciones que solo tiene este inversor
    exclusivas = acciones_propias.copy()
    for otro_inversor, otros_datos in portafolios.items():
        if otro_inversor != inversor:
            exclusivas = exclusivas - otros_datos["acciones"]
    
    if exclusivas:
        print(f"  {inversor}: {', '.join(sorted(exclusivas))}")

# Calcular valor promedio de acciones por portafolio
print("\nValor promedio de acciones:")
for inversor, datos in portafolios.items():
    acciones = datos["acciones"]
    valor_total = sum(precios[ticker] for ticker in acciones)
    valor_promedio = valor_total / len(acciones)
    print(f"  {inversor}: \${valor_promedio:.2f}")
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Cómo crear y usar diccionarios con pares clave-valor  
✓ Métodos de diccionarios: keys(), values(), items(), get(), pop()  
✓ Cómo crear y usar sets para elementos únicos  
✓ Operaciones de conjuntos: unión, intersección, diferencia  
✓ Cuándo usar diccionarios vs sets vs listas  

## Puntos Clave

- **Diccionarios**: Almacenan pares clave-valor - usa llaves \`{}\`
- **Keys**: Deben ser inmutables (strings, números, tuplas)
- **Values**: Pueden ser cualquier tipo de dato
- Usa \`.get()\` para acceso seguro sin errores
- **Sets**: Colecciones de elementos únicos y no ordenados
- Sets eliminan duplicados automáticamente
- **Operaciones de conjuntos**: unión (\`|\`), intersección (\`&\`), diferencia (\`-\`)
- Diccionarios son ideales para datos estructurados con nombres
- Sets son ideales para membresía y eliminación de duplicados
`
  },
  {
    id: '2-3',
    moduleId: '2',
    title: 'Comprensiones de Listas',
    orderIndex: 3,
    content: `# Comprensiones de Listas

## ¿Qué aprenderás?

- Crear listas de forma concisa con list comprehensions
- Aplicar filtros y transformaciones en una sola línea
- Usar comprensiones con diccionarios y sets
- Optimizar código financiero con comprensiones

## ¿Qué construirás?

Crearás análisis financieros eficientes usando comprensiones para procesar datos de múltiples acciones en pocas líneas de código.

**Nivel de dificultad:** Intermedio

---

## List Comprehensions: Sintaxis Concisa

Las **list comprehensions** permiten crear listas de forma elegante y eficiente en una sola línea.

### Sintaxis Básica

\`\`\`python
# Forma tradicional con bucle
cuadrados = []
for x in range(5):
    cuadrados.append(x ** 2)
print(cuadrados)  # [0, 1, 4, 9, 16]

# Con list comprehension (más conciso)
cuadrados = [x ** 2 for x in range(5)]
print(cuadrados)  # [0, 1, 4, 9, 16]

# Sintaxis general:
# [expresión for elemento in iterable]
\`\`\`

### Ejemplo Financiero Básico

\`\`\`python
# Precios de acciones
precios = [100, 105, 102, 108, 110]

# Calcular precios con descuento del 5%
precios_descuento = [precio * 0.95 for precio in precios]
print(precios_descuento)
# [95.0, 99.75, 96.9, 102.6, 104.5]

# Convertir precios a strings formateados
precios_formateados = [f"\${precio:.2f}" for precio in precios]
print(precios_formateados)
# ['$100.00', '$105.00', '$102.00', '$108.00', '$110.00']
\`\`\`

## Comprensiones con Condiciones

Puedes agregar condiciones para filtrar elementos:

\`\`\`python
# Sintaxis con filtro:
# [expresión for elemento in iterable if condición]

# Números pares del 0 al 9
pares = [x for x in range(10) if x % 2 == 0]
print(pares)  # [0, 2, 4, 6, 8]

# Precios mayores a 100
precios = [95, 105, 102, 98, 110, 115]
precios_altos = [p for p in precios if p > 100]
print(precios_altos)  # [105, 102, 110, 115]
\`\`\`

### Ejemplo: Filtrar Acciones por Criterio

\`\`\`python
# Datos de acciones bancarias
acciones = [
    {"ticker": "JPM", "precio": 150.0, "pe": 10.5},
    {"ticker": "BAC", "precio": 35.0, "pe": 9.8},
    {"ticker": "C", "precio": 50.0, "pe": 8.2},
    {"ticker": "WFC", "precio": 45.0, "pe": 11.2},
    {"ticker": "GS", "precio": 380.0, "pe": 15.5}
]

# Extraer tickers de acciones con P/E < 10
tickers_bajo_pe = [a["ticker"] for a in acciones if a["pe"] < 10]
print(tickers_bajo_pe)  # ['BAC', 'C']

# Extraer precios de acciones baratas (< $100)
precios_baratos = [a["precio"] for a in acciones if a["precio"] < 100]
print(precios_baratos)  # [35.0, 50.0, 45.0]

# Crear lista de strings descriptivos
descripciones = [
    f"{a['ticker']}: \${a['precio']} (P/E: {a['pe']})"
    for a in acciones
    if a["precio"] < 200
]
for desc in descripciones:
    print(desc)
# JPM: $150.0 (P/E: 10.5)
# BAC: $35.0 (P/E: 9.8)
# C: $50.0 (P/E: 8.2)
# WFC: $45.0 (P/E: 11.2)
\`\`\`

## Comprensiones con if-else

Puedes usar if-else para transformaciones condicionales:

\`\`\`python
# Sintaxis con if-else:
# [expresión_si if condición else expresión_no for elemento in iterable]

# Clasificar números como "par" o "impar"
numeros = [1, 2, 3, 4, 5]
clasificacion = ["par" if x % 2 == 0 else "impar" for x in numeros]
print(clasificacion)  # ['impar', 'par', 'impar', 'par', 'impar']

# Aplicar comisión diferenciada
precios = [100, 500, 1500, 3000]
# Comisión 1% si < $1000, sino 0.5%
precios_con_comision = [
    p * 1.01 if p < 1000 else p * 1.005
    for p in precios
]
print(precios_con_comision)
# [101.0, 505.0, 1507.5, 3015.0]
\`\`\`

## Comprensiones Anidadas

Puedes anidar comprensiones para trabajar con estructuras multidimensionales:

\`\`\`python
# Matriz de precios (filas = días, columnas = acciones)
precios_matriz = [
    [150, 35, 50],  # Día 1
    [152, 36, 51],  # Día 2
    [155, 34, 52]   # Día 3
]

# Aplanar matriz (convertir a lista simple)
todos_precios = [precio for fila in precios_matriz for precio in fila]
print(todos_precios)
# [150, 35, 50, 152, 36, 51, 155, 34, 52]

# Calcular promedio por columna (por acción)
num_dias = len(precios_matriz)
num_acciones = len(precios_matriz[0])

promedios = [
    sum(precios_matriz[dia][accion] for dia in range(num_dias)) / num_dias
    for accion in range(num_acciones)
]
print(promedios)  # [152.33, 35.0, 51.0]
\`\`\`

## Dictionary Comprehensions

Similar a list comprehensions, pero para crear diccionarios:

\`\`\`python
# Sintaxis:
# {clave: valor for elemento in iterable}

# Crear diccionario de cuadrados
cuadrados_dict = {x: x**2 for x in range(5)}
print(cuadrados_dict)
# {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}

# Diccionario de acciones con precios
tickers = ["JPM", "BAC", "C"]
precios = [150.0, 35.0, 50.0]

precio_por_ticker = {t: p for t, p in zip(tickers, precios)}
print(precio_por_ticker)
# {'JPM': 150.0, 'BAC': 35.0, 'C': 50.0}

# Filtrar diccionario
acciones_caras = {t: p for t, p in precio_por_ticker.items() if p > 40}
print(acciones_caras)
# {'JPM': 150.0, 'C': 50.0}
\`\`\`

## Set Comprehensions

También puedes crear sets con comprensiones:

\`\`\`python
# Sintaxis:
# {expresión for elemento in iterable}

# Set de cuadrados
cuadrados_set = {x**2 for x in range(5)}
print(cuadrados_set)  # {0, 1, 4, 9, 16}

# Extraer sectores únicos
acciones = [
    {"ticker": "JPM", "sector": "Banca"},
    {"ticker": "BAC", "sector": "Banca"},
    {"ticker": "AAPL", "sector": "Tecnología"},
    {"ticker": "MSFT", "sector": "Tecnología"}
]

sectores_unicos = {a["sector"] for a in acciones}
print(sectores_unicos)  # {'Banca', 'Tecnología'}
\`\`\`

## Ejemplo Completo: Análisis de Rendimientos

\`\`\`python
# Precios históricos de múltiples acciones (últimos 5 días)
datos_historicos = {
    "JPM": [145, 148, 150, 152, 155],
    "BAC": [33, 34, 35, 36, 35],
    "C": [48, 49, 50, 51, 52],
    "WFC": [43, 44, 45, 44, 46]
}

print("=== Análisis de Rendimientos ===\n")

# Calcular rendimiento total de cada acción
rendimientos_totales = {
    ticker: ((precios[-1] - precios[0]) / precios[0]) * 100
    for ticker, precios in datos_historicos.items()
}

print("Rendimientos totales (5 días):")
for ticker, rendimiento in sorted(rendimientos_totales.items()):
    print(f"{ticker}: {rendimiento:+.2f}%")

# Encontrar acciones con rendimiento positivo
acciones_positivas = [
    ticker for ticker, rend in rendimientos_totales.items()
    if rend > 0
]
print(f"\nAcciones con rendimiento positivo: {', '.join(acciones_positivas)}")

# Calcular rendimientos diarios para cada acción
rendimientos_diarios = {
    ticker: [
        ((precios[i] - precios[i-1]) / precios[i-1]) * 100
        for i in range(1, len(precios))
    ]
    for ticker, precios in datos_historicos.items()
}

# Calcular volatilidad (desviación estándar de rendimientos diarios)
import statistics

volatilidades = {
    ticker: statistics.stdev(rendimientos)
    for ticker, rendimientos in rendimientos_diarios.items()
}

print("\nVolatilidad (desviación estándar):")
for ticker, vol in sorted(volatilidades.items(), key=lambda x: x[1]):
    print(f"{ticker}: {vol:.2f}%")

# Clasificar acciones por riesgo
clasificacion_riesgo = {
    ticker: "Bajo" if vol < 2 else "Medio" if vol < 4 else "Alto"
    for ticker, vol in volatilidades.items()
}

print("\nClasificación de riesgo:")
for ticker, riesgo in clasificacion_riesgo.items():
    print(f"{ticker}: {riesgo}")

# Crear recomendaciones
# Comprar si: rendimiento > 5% y volatilidad < 4%
recomendaciones = {
    ticker: "COMPRAR" if rendimientos_totales[ticker] > 5 and volatilidades[ticker] < 4
            else "VENDER" if rendimientos_totales[ticker] < 0
            else "MANTENER"
    for ticker in datos_historicos.keys()
}

print("\nRecomendaciones:")
for ticker, rec in recomendaciones.items():
    print(f"{ticker}: {rec}")

# Resumen estadístico
print("\n=== Resumen del Mercado ===")
print(f"Rendimiento promedio: {sum(rendimientos_totales.values()) / len(rendimientos_totales):.2f}%")
print(f"Volatilidad promedio: {sum(volatilidades.values()) / len(volatilidades):.2f}%")
print(f"Acciones recomendadas para compra: {sum(1 for r in recomendaciones.values() if r == 'COMPRAR')}")
\`\`\`

## Comparación: Bucle vs Comprehension

\`\`\`python
# Ejemplo: Calcular valor de portafolio

portafolio = [
    ("JPM", 150.0, 10),
    ("BAC", 35.0, 20),
    ("C", 50.0, 15)
]

# Con bucle tradicional (5 líneas)
valores = []
for ticker, precio, cantidad in portafolio:
    valor = precio * cantidad
    valores.append(valor)

# Con list comprehension (1 línea)
valores = [precio * cantidad for ticker, precio, cantidad in portafolio]

print(valores)  # [1500.0, 700.0, 750.0]
print(f"Valor total: \${sum(valores):,.2f}")
\`\`\`

## Cuándo Usar Comprehensions

**Usa comprehensions cuando:**
- La lógica es simple y cabe en una línea
- Necesitas transformar o filtrar una colección
- Quieres código más legible y pythonic

**Usa bucles tradicionales cuando:**
- La lógica es compleja (múltiples condiciones)
- Necesitas múltiples operaciones por elemento
- La legibilidad se ve afectada

\`\`\`python
# ✅ BUENO: Comprehension simple
precios_dobles = [p * 2 for p in precios]

# ❌ MALO: Comprehension muy compleja
resultado = [
    calcular_algo(x, y, z) if condicion1(x) and condicion2(y) else otro_calculo(x)
    for x, y, z in zip(lista1, lista2, lista3)
    if x > 0 and y < 100 and z != 0
]

# ✅ MEJOR: Usar bucle tradicional para lógica compleja
resultado = []
for x, y, z in zip(lista1, lista2, lista3):
    if x > 0 and y < 100 and z != 0:
        if condicion1(x) and condicion2(y):
            resultado.append(calcular_algo(x, y, z))
        else:
            resultado.append(otro_calculo(x))
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ La sintaxis básica de list comprehensions  
✓ Cómo agregar condiciones con if  
✓ La diferencia entre if al final (filtro) y if-else (transformación)  
✓ Dictionary y set comprehensions  
✓ Cuándo usar comprehensions vs bucles tradicionales  

## Puntos Clave

- **List comprehensions**: Forma concisa de crear listas
- Sintaxis: \`[expresión for elemento in iterable if condición]\`
- **Filtro**: \`if\` al final filtra elementos
- **Transformación**: \`if-else\` transforma cada elemento
- También existen **dict comprehensions** y **set comprehensions**
- Usa comprehensions para código simple y legible
- Usa bucles tradicionales para lógica compleja
- Las comprehensions son más rápidas que bucles equivalentes
- Prioriza legibilidad sobre brevedad
`
  },
  {
    id: '2-4',
    moduleId: '2',
    title: 'Manipulación de Strings',
    orderIndex: 4,
    content: `# Manipulación de Strings

## ¿Qué aprenderás?

- Manipular y formatear cadenas de texto
- Usar métodos de strings para transformar datos
- Aplicar f-strings para formateo avanzado
- Procesar datos financieros en formato texto

## ¿Qué construirás?

Crearás un sistema de generación de reportes financieros que formatea y presenta datos de manera profesional usando manipulación de strings.

**Nivel de dificultad:** Principiante

---

## Strings en Python

Los **strings** (cadenas de texto) son secuencias inmutables de caracteres.

### Crear Strings

\`\`\`python
# Comillas simples o dobles
ticker = 'JPM'
nombre = "JPMorgan Chase"

# Strings multilínea con triple comillas
reporte = """
Análisis de JPMorgan Chase
Precio: $150.00
Recomendación: COMPRAR
"""

# String vacío
vacio = ""

# Concatenación
mensaje = "Ticker: " + ticker + " - " + nombre
print(mensaje)  # Ticker: JPM - JPMorgan Chase
\`\`\`

### Indexing y Slicing

Los strings se comportan como listas de caracteres:

\`\`\`python
ticker = "JPM"

# Indexing
primera_letra = ticker[0]    # "J"
ultima_letra = ticker[-1]    # "M"

# Slicing
nombre = "JPMorgan Chase"
primeras_tres = nombre[0:3]  # "JPM"
apellido = nombre[9:]        # "Chase"

# Longitud
longitud = len(nombre)       # 15
\`\`\`

## Métodos de Strings

### Cambiar Mayúsculas/Minúsculas

\`\`\`python
ticker = "jpm"

# Convertir a mayúsculas
ticker_upper = ticker.upper()  # "JPM"

# Convertir a minúsculas
ticker_lower = "JPM".lower()   # "jpm"

# Capitalizar primera letra
nombre = "jpmorgan chase"
nombre_cap = nombre.capitalize()  # "Jpmorgan chase"

# Title case (cada palabra capitalizada)
nombre_title = nombre.title()  # "Jpmorgan Chase"
\`\`\`

### Buscar y Verificar

\`\`\`python
nombre = "JPMorgan Chase Bank"

# Verificar si contiene substring
tiene_bank = "Bank" in nombre  # True
tiene_tech = "Tech" in nombre  # False

# Encontrar posición
posicion = nombre.find("Chase")  # 9
no_encontrado = nombre.find("Tech")  # -1

# Contar ocurrencias
cantidad_a = nombre.count("a")  # 3

# Verificar inicio/fin
empieza_jpm = nombre.startswith("JPM")  # True
termina_bank = nombre.endswith("Bank")  # True
\`\`\`

### Dividir y Unir

\`\`\`python
# split: dividir string en lista
datos = "JPM,150.0,10,Banca"
partes = datos.split(",")
print(partes)  # ['JPM', '150.0', '10', 'Banca']

ticker, precio, cantidad, sector = datos.split(",")

# join: unir lista en string
tickers = ["JPM", "BAC", "C", "WFC"]
tickers_str = ", ".join(tickers)
print(tickers_str)  # "JPM, BAC, C, WFC"

# splitlines: dividir por líneas
texto = """JPM
BAC
C"""
lineas = texto.splitlines()
print(lineas)  # ['JPM', 'BAC', 'C']
\`\`\`

### Limpiar Espacios

\`\`\`python
# strip: eliminar espacios al inicio y final
ticker = "  JPM  "
ticker_limpio = ticker.strip()  # "JPM"

# lstrip: eliminar espacios a la izquierda
ticker_left = "  JPM".lstrip()  # "JPM"

# rstrip: eliminar espacios a la derecha
ticker_right = "JPM  ".rstrip()  # "JPM"

# Eliminar caracteres específicos
precio_str = "$150.00"
precio_limpio = precio_str.strip("$")  # "150.00"
\`\`\`

### Reemplazar

\`\`\`python
# replace: reemplazar substring
texto = "El precio de JPM es $150"
texto_nuevo = texto.replace("JPM", "BAC")
print(texto_nuevo)  # "El precio de BAC es $150"

# Reemplazar múltiples ocurrencias
texto = "JPM JPM JPM"
texto_nuevo = texto.replace("JPM", "BAC", 2)  # Reemplazar solo 2
print(texto_nuevo)  # "BAC BAC JPM"
\`\`\`

## Formateo de Strings

### F-Strings (Recomendado)

Las **f-strings** son la forma moderna y más legible de formatear strings:

\`\`\`python
ticker = "JPM"
precio = 150.75
cantidad = 10

# F-string básico
mensaje = f"Ticker: {ticker}, Precio: \${precio}"
print(mensaje)  # Ticker: JPM, Precio: $150.75

# Con expresiones
valor = precio * cantidad
mensaje = f"Valor total: \${precio * cantidad}"
print(mensaje)  # Valor total: $1507.5

# Formateo de números
precio = 1507.5
print(f"Precio: \${precio:,.2f}")  # Precio: $1,507.50
# ,.2f = separador de miles (,) y 2 decimales (.2f)

# Alineación
ticker = "JPM"
print(f"|{ticker:<10}|")  # |JPM       | (izquierda)
print(f"|{ticker:>10}|")  # |       JPM| (derecha)
print(f"|{ticker:^10}|")  # |   JPM    | (centro)

# Porcentajes
rendimiento = 0.1071
print(f"Rendimiento: {rendimiento:.2%}")  # Rendimiento: 10.71%
\`\`\`

### Format Method

\`\`\`python
# Método format (alternativa a f-strings)
mensaje = "Ticker: {}, Precio: \${}".format("JPM", 150.75)

# Con nombres
mensaje = "Ticker: {t}, Precio: \${p:.2f}".format(t="JPM", p=150.75)

# Con índices
mensaje = "{0} tiene un precio de \${1}".format("JPM", 150.75)
\`\`\`

## Ejemplo Financiero: Generador de Reportes

\`\`\`python
# Datos de acciones
acciones = [
    {"ticker": "JPM", "nombre": "JPMorgan Chase", "precio": 150.75, 
     "cantidad": 10, "precio_compra": 140.0},
    {"ticker": "BAC", "nombre": "Bank of America", "precio": 35.20, 
     "cantidad": 20, "precio_compra": 30.0},
    {"ticker": "C", "nombre": "Citigroup", "precio": 50.45, 
     "cantidad": 15, "precio_compra": 45.0}
]

# Generar reporte formateado
print("=" * 80)
print(f"{'REPORTE DE PORTAFOLIO':^80}")
print("=" * 80)
print()

# Encabezado de tabla
print(f"{'Ticker':<8} {'Nombre':<20} {'Precio':>10} {'Cant':>6} {'Valor':>12} {'Ganancia':>12}")
print("-" * 80)

# Datos de cada acción
valor_total = 0
ganancia_total = 0

for accion in acciones:
    ticker = accion["ticker"]
    nombre = accion["nombre"]
    precio = accion["precio"]
    cantidad = accion["cantidad"]
    precio_compra = accion["precio_compra"]
    
    valor = precio * cantidad
    ganancia = (precio - precio_compra) * cantidad
    
    valor_total += valor
    ganancia_total += ganancia
    
    # Formatear fila
    print(f"{ticker:<8} {nombre:<20} \${precio:>9.2f} {cantidad:>6} "
          f"\${valor:>11,.2f} \${ganancia:>+11,.2f}")

# Totales
print("-" * 80)
print(f"{'TOTAL':<8} {'':<20} {'':<10} {'':<6} "
      f"\${valor_total:>11,.2f} \${ganancia_total:>+11,.2f}")
print("=" * 80)

# Resumen
rendimiento_total = (ganancia_total / (valor_total - ganancia_total)) * 100
print()
print(f"Valor total del portafolio: \${valor_total:,.2f}")
print(f"Ganancia total: \${ganancia_total:+,.2f}")
print(f"Rendimiento total: {rendimiento_total:+.2f}%")
\`\`\`

## Procesamiento de Datos CSV

\`\`\`python
# Simular lectura de archivo CSV
datos_csv = """ticker,precio,cantidad
JPM,150.75,10
BAC,35.20,20
C,50.45,15"""

# Procesar líneas
lineas = datos_csv.strip().splitlines()

# Extraer encabezado
encabezado = lineas[0].split(",")
print(f"Columnas: {encabezado}")

# Procesar datos
portafolio = []
for linea in lineas[1:]:  # Saltar encabezado
    partes = linea.split(",")
    ticker = partes[0]
    precio = float(partes[1])
    cantidad = int(partes[2])
    
    portafolio.append({
        "ticker": ticker,
        "precio": precio,
        "cantidad": cantidad
    })

# Mostrar datos procesados
for accion in portafolio:
    print(f"{accion['ticker']}: \${accion['precio']} × {accion['cantidad']}")
\`\`\`

## Validación de Datos

\`\`\`python
def validar_ticker(ticker):
    """Valida que un ticker sea válido."""
    # Debe ser string
    if not isinstance(ticker, str):
        return False, "El ticker debe ser un string"
    
    # Eliminar espacios
    ticker = ticker.strip().upper()
    
    # Debe tener 1-5 caracteres
    if len(ticker) < 1 or len(ticker) > 5:
        return False, "El ticker debe tener entre 1 y 5 caracteres"
    
    # Solo letras
    if not ticker.isalpha():
        return False, "El ticker solo debe contener letras"
    
    return True, ticker

# Probar validación
tickers_prueba = ["JPM", "  bac  ", "C1", "TOOLONG", ""]

for ticker in tickers_prueba:
    valido, resultado = validar_ticker(ticker)
    if valido:
        print(f"✓ '{ticker}' → '{resultado}' (válido)")
    else:
        print(f"✗ '{ticker}' → {resultado}")

# Salida:
# ✓ 'JPM' → 'JPM' (válido)
# ✓ '  bac  ' → 'BAC' (válido)
# ✗ 'C1' → El ticker solo debe contener letras
# ✗ 'TOOLONG' → El ticker debe tener entre 1 y 5 caracteres
# ✗ '' → El ticker debe tener entre 1 y 5 caracteres
\`\`\`

## Ejemplo Completo: Sistema de Alertas

\`\`\`python
# Plantilla de mensaje de alerta
def generar_alerta(ticker, precio_actual, precio_objetivo, tipo):
    """Genera mensaje de alerta formateado."""
    
    # Calcular diferencia
    diferencia = precio_actual - precio_objetivo
    porcentaje = (diferencia / precio_objetivo) * 100
    
    # Símbolos según tipo
    simbolos = {
        "objetivo": "🎯",
        "stop_loss": "⚠️",
        "compra": "💰",
        "venta": "📈"
    }
    
    simbolo = simbolos.get(tipo, "📊")
    
    # Generar mensaje
    mensaje = f"""
{simbolo} ALERTA DE {tipo.upper().replace('_', ' ')}
{'=' * 50}
Ticker: {ticker}
Precio actual: \${precio_actual:.2f}
Precio objetivo: \${precio_objetivo:.2f}
Diferencia: \${diferencia:+.2f} ({porcentaje:+.2f}%)
{'=' * 50}
"""
    
    return mensaje.strip()

# Generar alertas
alertas = [
    ("JPM", 165.0, 160.0, "objetivo"),
    ("BAC", 28.0, 30.0, "stop_loss"),
    ("C", 48.0, 50.0, "compra")
]

for ticker, precio_actual, precio_objetivo, tipo in alertas:
    alerta = generar_alerta(ticker, precio_actual, precio_objetivo, tipo)
    print(alerta)
    print()
\`\`\`

## Métodos Útiles de Verificación

\`\`\`python
# isdigit: verifica si todos son dígitos
"123".isdigit()    # True
"12.3".isdigit()   # False

# isalpha: verifica si todos son letras
"JPM".isalpha()    # True
"JPM1".isalpha()   # False

# isalnum: verifica si son letras o números
"JPM123".isalnum()  # True
"JPM-123".isalnum() # False

# isupper/islower: verifica mayúsculas/minúsculas
"JPM".isupper()    # True
"jpm".islower()    # True

# Ejemplo: Limpiar y validar input
def procesar_ticker(input_usuario):
    # Limpiar
    ticker = input_usuario.strip().upper()
    
    # Validar
    if not ticker.isalpha():
        return None, "Ticker inválido: debe contener solo letras"
    
    if len(ticker) < 1 or len(ticker) > 5:
        return None, "Ticker inválido: longitud incorrecta"
    
    return ticker, "OK"

# Probar
inputs = ["  jpm  ", "BAC", "C123", "TOOLONGNAME"]
for inp in inputs:
    ticker, mensaje = procesar_ticker(inp)
    if ticker:
        print(f"✓ '{inp}' → '{ticker}'")
    else:
        print(f"✗ '{inp}' → {mensaje}")
\`\`\`

## Checkpoint de Comprensión

Antes de continuar, asegúrate de entender:

✓ Métodos básicos de strings: upper(), lower(), strip(), split(), join()  
✓ Formateo con f-strings y especificadores de formato  
✓ Cómo buscar y reemplazar en strings  
✓ Validación de datos con métodos is*()  
✓ Procesamiento de datos en formato texto  

## Puntos Clave

- **Strings son inmutables**: Los métodos retornan nuevos strings
- **F-strings**: Forma moderna de formateo - \`f"Valor: {variable}"\`
- **Formateo de números**: \`{valor:,.2f}\` para separador de miles y 2 decimales
- **split() y join()**: Dividir y unir strings
- **strip()**: Eliminar espacios en blanco
- **Métodos de verificación**: isdigit(), isalpha(), isalnum()
- Usa \`.upper()\` o \`.lower()\` para comparaciones case-insensitive
- Los strings soportan indexing y slicing como las listas
- Siempre valida y limpia datos de entrada del usuario
`
  }
];

// Combine all lessons including Module 3
const allLessons = [...sampleLessons, ...module3Lessons];

export { allLessons as sampleLessons };

export function getLessonById(lessonId: string): Lesson | undefined {
  return allLessons.find(lesson => lesson.id === lessonId);
}

export function getLessonsByModule(moduleId: string): Lesson[] {
  return allLessons
    .filter(lesson => lesson.moduleId === moduleId)
    .sort((a, b) => a.orderIndex - b.orderIndex);
}
