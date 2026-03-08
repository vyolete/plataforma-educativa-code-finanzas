# Especificación del Trabajo 1

## Información General

- **Nombre**: Trabajo 1 - Fundamentos de Python y Análisis de Datos
- **Ponderación**: 20% de la calificación final
- **Fecha de entrega**: Semana 6 del semestre (calculada automáticamente)
- **Tipo de entrega**: Trabajo en equipo (2-4 miembros)
- **Módulos cubiertos**: Módulo 1 (Fundamentos de Python) y Módulo 2 (Estructuras de Datos)

## Objetivos de Aprendizaje

Al completar este trabajo, los estudiantes demostrarán:

1. Dominio de fundamentos de Python (variables, estructuras de control, funciones)
2. Manejo de estructuras de datos (listas, diccionarios, tuplas, sets)
3. Capacidad de análisis de datos usando Pandas
4. Habilidad para crear visualizaciones básicas
5. Aplicación de conceptos de programación a problemas financieros simples

## Requisitos del Proyecto

### 1. Formato de Entrega

- **Archivo**: Notebook de Jupyter (.ipynb)
- **Tamaño máximo**: 10 MB
- **Nombre sugerido**: `Trabajo1_NombreEquipo.ipynb`
- **Confirmación**: Todos los miembros del equipo deben confirmar la entrega

### 2. Estructura del Notebook

El notebook debe contener las siguientes secciones claramente identificadas:

#### 2.1 Encabezado
- Título del trabajo
- Nombres completos de los integrantes del equipo
- Correos institucionales
- Fecha de entrega
- Nombre del equipo

#### 2.2 Introducción (10%)
- Breve descripción del problema a resolver
- Objetivos del análisis
- Fuente de los datos utilizados

#### 2.3 Análisis de Datos con Pandas (40%)
**Requisito obligatorio**: El notebook debe incluir análisis de datos utilizando la biblioteca Pandas.

Debe incluir al menos:
- Carga de datos desde archivo CSV o mediante yfinance
- Exploración inicial de datos (head, info, describe)
- Limpieza de datos (manejo de valores faltantes, duplicados)
- Filtrado y selección de datos relevantes
- Cálculos y transformaciones usando operaciones de Pandas
- Agrupaciones y agregaciones (groupby)

#### 2.4 Visualizaciones (30%)
**Requisito obligatorio**: El notebook debe incluir al menos 2 visualizaciones diferentes.

Las visualizaciones deben:
- Ser relevantes para el análisis realizado
- Incluir títulos descriptivos
- Tener ejes etiquetados correctamente
- Incluir leyendas cuando sea necesario
- Ser de tipos diferentes (ej: gráfico de líneas + gráfico de barras)

Tipos de visualizaciones sugeridas:
- Gráficos de líneas (evolución temporal)
- Gráficos de barras (comparaciones)
- Histogramas (distribuciones)
- Scatter plots (correlaciones)
- Gráficos de pastel (proporciones)

#### 2.5 Conclusiones (10%)
- Resumen de hallazgos principales
- Interpretación de resultados
- Limitaciones del análisis
- Posibles mejoras o análisis futuros

#### 2.6 Código y Documentación (10%)
- Código limpio y bien organizado
- Comentarios explicativos en secciones clave
- Uso apropiado de funciones
- Nombres de variables descriptivos
- Seguimiento de buenas prácticas de Python (PEP 8)

## Rúbrica de Evaluación

| Criterio | Excelente (100%) | Bueno (80%) | Satisfactorio (60%) | Insuficiente (40%) | Puntos |
|----------|------------------|-------------|---------------------|-------------------|--------|
| **Introducción** | Introducción clara, objetivos bien definidos, contexto completo | Introducción adecuada, objetivos claros | Introducción básica, objetivos poco claros | Introducción incompleta o ausente | /10 |
| **Análisis con Pandas** | Análisis completo, uso avanzado de Pandas, transformaciones complejas | Análisis adecuado, uso correcto de Pandas | Análisis básico, uso limitado de Pandas | Análisis incompleto o sin Pandas | /40 |
| **Visualizaciones** | 3+ visualizaciones excelentes, bien diseñadas y relevantes | 2 visualizaciones buenas y relevantes | 2 visualizaciones básicas | Menos de 2 visualizaciones o de baja calidad | /30 |
| **Conclusiones** | Conclusiones profundas, bien fundamentadas, con insights valiosos | Conclusiones adecuadas y fundamentadas | Conclusiones básicas | Conclusiones superficiales o ausentes | /10 |
| **Código y Documentación** | Código excelente, muy bien documentado, sigue PEP 8 | Código bueno, bien documentado | Código funcional, documentación básica | Código desorganizado, sin documentación | /10 |
| **TOTAL** | | | | | /100 |

### Criterios Adicionales

- **Penalización por entrega tardía**: -10 puntos por día de retraso (máximo 3 días)
- **Bonificación por excelencia**: +5 puntos por análisis excepcional o visualizaciones innovadoras
- **Requisito de confirmación**: Si no todos los miembros confirman la entrega antes de la fecha límite, la entrega se considera inválida

## Temas Sugeridos

Los equipos pueden elegir uno de los siguientes temas o proponer uno propio (sujeto a aprobación):

1. **Análisis de Acciones Bancarias**
   - Comparar precios históricos de JPMorgan, Bank of America, Citigroup, Wells Fargo
   - Calcular rendimientos simples
   - Visualizar evolución de precios

2. **Análisis de Tasas de Interés**
   - Analizar datos históricos de tasas de interés
   - Comparar diferentes tipos de tasas
   - Visualizar tendencias temporales

3. **Análisis de Indicadores Económicos**
   - Analizar PIB, inflación, desempleo
   - Identificar correlaciones
   - Visualizar relaciones entre indicadores

4. **Análisis de Portafolio Simple**
   - Analizar rendimientos de múltiples activos
   - Calcular estadísticas básicas
   - Visualizar distribución de rendimientos

## Recursos Disponibles

### Bibliotecas Permitidas
- pandas
- numpy
- matplotlib
- yfinance (para obtener datos financieros)

### Fuentes de Datos Sugeridas
- yfinance (datos de acciones y mercados)
- Archivos CSV proporcionados por el profesor
- Datos públicos de bancos centrales
- Datos de Yahoo Finance

### Ejemplos de Código
Los estudiantes pueden consultar:
- Lecciones de Módulo 1 y 2 en la plataforma
- Ejercicios resueltos
- Biblioteca de snippets de código
- Documentación oficial de Pandas

## Proceso de Entrega

1. **Preparación del Notebook**
   - Completar todas las secciones requeridas
   - Verificar que el código se ejecuta sin errores
   - Revisar ortografía y redacción

2. **Subida a la Plataforma**
   - Un miembro del equipo sube el archivo .ipynb
   - El sistema valida automáticamente el formato y requisitos básicos
   - Se genera una notificación para todos los miembros

3. **Confirmación por Miembros**
   - Cada miembro del equipo debe confirmar la entrega
   - Plazo de confirmación: antes de la fecha límite
   - El sistema marca la entrega como válida solo cuando todos confirman

4. **Validación Automática**
   - El sistema verifica que incluye análisis con Pandas
   - El sistema verifica que incluye al menos 2 visualizaciones
   - El sistema verifica la estructura del notebook
   - Si falta algún requisito, se notifica al equipo

5. **Revisión por el Profesor**
   - El profesor revisa las entregas confirmadas
   - Asigna calificación según la rúbrica
   - Proporciona retroalimentación escrita

## Validaciones Automáticas

El sistema realiza las siguientes validaciones al momento de la entrega:

### Validaciones de Formato
- ✓ Archivo es un notebook válido (.ipynb)
- ✓ Tamaño no excede 10 MB
- ✓ Estructura JSON del notebook es válida

### Validaciones de Contenido
- ✓ Contiene al menos una celda con importación de pandas
- ✓ Contiene al menos una celda con operaciones de pandas (DataFrame, Series)
- ✓ Contiene al menos 2 celdas con código de visualización (plt.plot, plt.bar, etc.)
- ✓ Las visualizaciones se ejecutan sin errores

### Validaciones de Equipo
- ✓ Todos los miembros del equipo han confirmado la entrega
- ✓ La entrega se realizó antes de la fecha límite (o se marca como tardía)

## Preguntas Frecuentes

**P: ¿Podemos usar bibliotecas adicionales?**
R: Solo las bibliotecas listadas en "Bibliotecas Permitidas". Si necesitan otra, deben solicitar aprobación al profesor.

**P: ¿Qué pasa si un miembro del equipo no confirma?**
R: La entrega no será válida hasta que todos confirmen. Asegúrense de coordinar con tiempo.

**P: ¿Podemos entregar después de la fecha límite?**
R: Sí, pero con penalización de -10 puntos por día (máximo 3 días de retraso).

**P: ¿Cuántas visualizaciones debemos incluir?**
R: Mínimo 2, pero se recomienda 3-4 para un análisis más completo.

**P: ¿El código debe ejecutarse sin errores?**
R: Sí, el notebook debe ejecutarse completamente sin errores. Prueben ejecutar "Run All" antes de entregar.

**P: ¿Podemos reutilizar código de los ejercicios?**
R: Sí, pueden adaptar código de ejercicios y lecciones, pero deben entender y poder explicar cada línea.

## Criterios de Éxito

Una entrega exitosa debe:
- ✓ Cumplir todos los requisitos técnicos (Pandas, 2+ visualizaciones)
- ✓ Demostrar comprensión de los conceptos de Módulo 1 y 2
- ✓ Presentar análisis coherente y bien documentado
- ✓ Incluir visualizaciones claras y relevantes
- ✓ Estar confirmada por todos los miembros del equipo
- ✓ Entregarse a tiempo o con retraso mínimo

## Contacto y Soporte

Para dudas sobre el Trabajo 1:
- Consultar durante las clases (martes y jueves 6:00-8:00 PM)
- Usar el sistema de pistas en la plataforma
- Revisar ejemplos en los módulos 1 y 2
- Contactar al profesor por correo institucional
