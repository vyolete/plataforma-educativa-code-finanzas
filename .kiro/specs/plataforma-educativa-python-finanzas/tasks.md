# Plan de Implementación: Plataforma Educativa de Python para Análisis Financiero

## Descripción General

Este plan implementa una plataforma educativa web moderna para enseñar Python aplicado a análisis financiero. La arquitectura utiliza Next.js + TypeScript para el frontend, FastAPI + Python para el backend, Supabase para base de datos, Cloudinary para almacenamiento, y Pyodide para ejecución de Python en el navegador.

El plan sigue un enfoque de entrega incremental en 4 fases, comenzando con el MVP (Módulos 1-3) y expandiendo funcionalidad progresivamente.

## Stack Tecnológico

- **Frontend**: Next.js 14, React, TypeScript, Monaco Editor, Pyodide
- **Backend**: FastAPI, Python 3.11, SQLAlchemy, Pydantic
- **Base de Datos**: PostgreSQL (Supabase)
- **Almacenamiento**: Cloudinary
- **Autenticación**: JWT + Supabase Auth
- **Deployment**: Vercel (frontend), Railway/Render (backend)

## Tareas

### Fase 1: MVP - Infraestructura y Módulos 1-3

- [x] 1. Configuración inicial del proyecto
  - [x] 1.1 Crear estructura del proyecto Next.js con TypeScript
    - Inicializar proyecto Next.js 14 con App Router
    - Configurar TypeScript, ESLint, Prettier
    - Configurar Tailwind CSS para estilos
    - Crear estructura de carpetas según diseño
    - _Requisitos: 3.1, 3.2_
  
  - [x] 1.2 Configurar proyecto FastAPI backend
    - Inicializar proyecto Python con FastAPI
    - Configurar estructura de carpetas (models, schemas, api, services)
    - Configurar CORS para permitir requests desde frontend
    - Crear archivo requirements.txt con dependencias
    - _Requisitos: 3.1, 3.2_

  - [x] 1.3 Configurar base de datos PostgreSQL en Supabase
    - Crear proyecto en Supabase
    - Ejecutar script SQL para crear tablas (users, semesters, teams, exercises, submissions, grades, etc.)
    - Configurar índices para optimización de queries
    - Obtener connection string y configurar en backend
    - _Requisitos: 3.3_
  
  - [ ]* 1.4 Escribir tests de propiedad para validación de correo institucional
    - **Propiedad 1: Validación de Correo Institucional**
    - **Valida: Requisitos 1.1, 1.2**

- [x] 2. Sistema de autenticación y gestión de usuarios
  - [x] 2.1 Implementar modelos de base de datos para usuarios y autenticación
    - Crear modelo User con SQLAlchemy (email, password_hash, full_name, role, semester_id)
    - Crear modelo Invitation para tokens de invitación
    - Implementar relaciones entre modelos
    - _Requisitos: 1.1, 1.2, 2.1_
  
  - [x] 2.2 Implementar endpoints de autenticación en FastAPI
    - POST /api/auth/register - Registro con validación de correo institucional
    - POST /api/auth/login - Login con JWT tokens
    - GET /api/auth/me - Obtener usuario actual
    - Implementar middleware de autenticación
    - _Requisitos: 1.1, 1.2, 1.3_
  
  - [x] 2.3 Implementar sistema de invitaciones para profesores
    - POST /api/auth/invite - Cargar CSV y enviar invitaciones
    - Validar formato de correos institucionales
    - Generar tokens UUID únicos con expiración
    - Integrar con servicio de email (SendGrid/Resend)
    - _Requisitos: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 2.4 Escribir tests de propiedad para validación de CSV
    - **Propiedad 2: Validación de CSV de Invitaciones**
    - **Valida: Requisitos 2.2, 2.3**
  
  - [ ]* 2.5 Escribir tests de propiedad para registro con invitación
    - **Propiedad 3: Registro con Invitación Válida**
    - **Valida: Requisito 2.6**
  
  - [x] 2.6 Crear componentes de autenticación en frontend
    - Página de login con formulario
    - Página de registro con validación de token de invitación
    - Componente de protección de rutas (middleware)
    - Context API para estado de autenticación
    - _Requisitos: 1.1, 1.2, 1.3, 2.6_


- [x] 3. Gestión de semestres
  - [x] 3.1 Implementar modelo y endpoints de semestres
    - Crear modelo Semester (name, start_date, end_date, status)
    - POST /api/semesters - Crear semestre (solo profesores)
    - GET /api/semesters - Listar semestres
    - GET /api/semesters/{id}/due-dates - Calcular fechas de entrega automáticamente
    - _Requisitos: 33.1, 33.2, 33.3, 33.14_
  
  - [ ]* 3.2 Escribir tests de propiedad para validación de duración de semestre
    - **Propiedad 13: Validación de Duración de Semestre**
    - **Valida: Requisito 33.3**
  
  - [ ]* 3.3 Escribir tests de propiedad para cálculo de fechas de entrega
    - **Propiedad 14: Cálculo de Fechas de Entrega**
    - **Valida: Requisito 33.14**
  
  - [x] 3.4 Crear interfaz de gestión de semestres para profesores
    - Página de administración de semestres
    - Formulario de creación con validación de fechas
    - Vista de semestre activo con fechas de entrega
    - _Requisitos: 33.1, 33.2, 33.14_

- [x] 4. Integración de Pyodide para ejecución de Python
  - [x] 4.1 Configurar Web Worker para Pyodide
    - Crear worker de Pyodide (workers/pyodide.worker.ts)
    - Implementar carga de Pyodide desde CDN
    - Cargar paquetes necesarios (numpy, pandas, matplotlib)
    - Configurar matplotlib para output en base64
    - _Requisitos: 4.1, 4.2_
  
  - [x] 4.2 Implementar sistema de ejecución de código Python
    - Crear hook usePyodide para React
    - Implementar captura de stdout y stderr
    - Implementar captura de gráficos matplotlib
    - Manejar errores de sintaxis y runtime
    - Implementar timeout de 30 segundos
    - _Requisitos: 5.1, 5.2, 5.3_
  
  - [ ]* 4.3 Escribir tests de propiedad para tiempo de ejecución
    - **Propiedad 4: Tiempo de Ejecución de Código**
    - **Valida: Requisito 5.2**
  
  - [ ]* 4.4 Escribir tests de propiedad para reporte de errores
    - **Propiedad 5: Reporte de Errores de Sintaxis**
    - **Valida: Requisito 5.3**


- [x] 5. Interfaz de laboratorio con 4 paneles
  - [x] 5.1 Implementar layout de 4 paneles redimensionables
    - Crear componente LaboratoryLayout con ResizablePanelGroup
    - Implementar Panel de Contenido (25% ancho inicial)
    - Implementar Panel de Código (35% ancho inicial)
    - Implementar Panel de Resultados (25% ancho inicial)
    - Implementar Panel de Ejercicios (15% ancho inicial)
    - Guardar tamaños de paneles en localStorage
    - _Requisitos: 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [x] 5.2 Implementar Panel de Contenido
    - Renderizar contenido de lecciones en formato Markdown
    - Mostrar ejemplos de código con syntax highlighting
    - Implementar navegación entre lecciones
    - _Requisitos: 3.4, 11.1_
  
  - [x] 5.3 Implementar Panel de Código con Monaco Editor
    - Integrar Monaco Editor con tema oscuro
    - Configurar autocompletado para Python
    - Agregar snippets personalizados para bibliotecas financieras
    - Implementar atajo Ctrl+Enter para ejecutar
    - Implementar validación de sintaxis en tiempo real
    - _Requisitos: 3.5, 12.1, 12.2, 12.3_
  
  - [x] 5.4 Implementar Panel de Resultados
    - Mostrar output de texto (stdout)
    - Renderizar gráficos matplotlib como imágenes
    - Mostrar errores con formato legible
    - Implementar tabs para múltiples outputs
    - _Requisitos: 3.6, 5.2, 5.3_
  
  - [x] 5.5 Implementar Panel de Ejercicios
    - Listar ejercicios del módulo actual
    - Mostrar estado (completado/pendiente)
    - Implementar selector de ejercicio
    - Cargar código inicial al seleccionar ejercicio
    - _Requisitos: 3.7, 6.1_

- [x] 6. Sistema de ejercicios con validación automática
  - [x] 6.1 Implementar modelos de ejercicios en backend
    - Crear modelo Exercise (title, description, starter_code, test_cases, hints)
    - Crear modelo ExerciseSubmission (user_id, exercise_id, code, status)
    - Implementar relaciones con módulos y lecciones
    - _Requisitos: 6.1, 6.2_
  
  - [x] 6.2 Implementar endpoints de ejercicios
    - GET /api/exercises/module/{module_id} - Listar ejercicios por módulo
    - GET /api/exercises/{id} - Obtener ejercicio específico
    - POST /api/exercises/{id}/submit - Enviar solución
    - GET /api/exercises/{id}/hints - Obtener pistas progresivas
    - _Requisitos: 6.1, 6.2, 6.3, 8.1_


  - [x] 6.3 Implementar validación automática de ejercicios
    - Ejecutar casos de prueba en Pyodide
    - Comparar output esperado vs output real
    - Marcar ejercicio como completado si todos los tests pasan
    - Actualizar progreso del estudiante automáticamente
    - _Requisitos: 6.3, 6.4_
  
  - [ ]* 6.4 Escribir tests de propiedad para validación de ejercicios
    - **Propiedad 6: Validación Automática de Ejercicios**
    - **Valida: Requisito 6.3**
  
  - [ ]* 6.5 Escribir tests de propiedad para actualización de progreso
    - **Propiedad 7: Actualización de Progreso**
    - **Valida: Requisito 6.4**
  
  - [x] 6.6 Crear interfaz de ejercicios en frontend
    - Componente de visualización de ejercicio
    - Indicador de tests pasados/fallidos
    - Botón de envío de solución
    - Animación de celebración al completar
    - _Requisitos: 6.1, 6.3, 6.4_

- [x] 7. Sistema de tutoriales y pistas
  - [x] 7.1 Implementar sistema de tutoriales interactivos
    - Crear componente de tutorial con pasos guiados
    - Implementar overlay de resaltado de elementos
    - Agregar tooltips explicativos
    - Guardar progreso de tutorial en localStorage
    - _Requisitos: 7.1, 7.2_
  
  - [x] 7.2 Implementar sistema de pistas progresivas
    - Mostrar pistas una a la vez
    - Implementar botón "Mostrar siguiente pista"
    - Limitar número de pistas disponibles
    - Registrar uso de pistas en backend
    - _Requisitos: 8.1, 8.2_

- [x] 8. Retroalimentación en tiempo real
  - [x] 8.1 Implementar validación de sintaxis en tiempo real
    - Detectar errores comunes de Python
    - Mostrar warnings en el editor
    - Sugerir correcciones automáticas
    - _Requisitos: 13.1, 13.2_
  
  - [x] 8.2 Implementar sistema de feedback inmediato
    - Mostrar mensajes de éxito/error al ejecutar código
    - Indicar qué tests pasaron/fallaron
    - Sugerir mejoras de código
    - _Requisitos: 13.1, 13.2_


- [x] 9. Gestión de equipos
  - [x] 9.1 Implementar modelos de equipos en backend
    - Crear modelo Team (name, semester_id, repository_url, leader_id)
    - Crear modelo TeamMember (team_id, user_id)
    - Implementar validación de tamaño de equipo (2-4 miembros)
    - _Requisitos: 9.1, 9.2, 9.6, 9.7_
  
  - [x] 9.2 Implementar endpoints de gestión de equipos
    - POST /api/teams - Crear equipo
    - POST /api/teams/{id}/invite - Invitar miembro
    - POST /api/teams/{id}/join - Aceptar invitación
    - DELETE /api/teams/{id}/members/{user_id} - Remover miembro
    - GET /api/teams - Listar equipos del semestre
    - _Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 9.3 Escribir tests de propiedad para límites de tamaño de equipo
    - **Propiedad 8: Límites de Tamaño de Equipo**
    - **Valida: Requisitos 9.6, 9.7**
  
  - [x] 9.4 Crear interfaz de gestión de equipos
    - Página de creación de equipo
    - Lista de miembros con roles
    - Sistema de invitaciones
    - Vista de equipos del semestre
    - _Requisitos: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10. Integración con GitHub
  - [x] 10.1 Implementar OAuth de GitHub en backend
    - Configurar GitHub OAuth App
    - POST /api/auth/github/connect - Conectar cuenta GitHub
    - Almacenar token de GitHub encriptado
    - _Requisitos: 34.1, 34.2_
  
  - [x] 10.2 Implementar vinculación de repositorio a equipo
    - PUT /api/teams/{id}/repository - Vincular repositorio
    - Validar que el repositorio existe y el usuario tiene acceso
    - Mostrar información del repositorio en interfaz
    - _Requisitos: 34.3, 34.4_
  
  - [x] 10.3 Crear componente de conexión con GitHub
    - Botón de "Conectar con GitHub"
    - Flujo de OAuth
    - Selector de repositorio
    - _Requisitos: 34.1, 34.2, 34.3_


- [x] 11. Integración con Google Colab
  - [x] 11.1 Implementar exportación a formato .ipynb
    - POST /api/colab/export - Convertir código a notebook
    - Generar estructura JSON de notebook válida
    - Incluir metadata de Colab
    - _Requisitos: 37.1, 37.2, 37.3_
  
  - [x] 11.2 Implementar importación desde Colab
    - POST /api/colab/import - Importar notebook
    - Parsear estructura de notebook
    - Extraer código de celdas
    - _Requisitos: 37.9, 37.10_
  
  - [ ]* 11.3 Escribir tests de propiedad para round-trip de notebooks
    - **Propiedad 15: Round-Trip de Integración con Google Colab**
    - **Valida: Requisitos 37.3, 37.9, 37.20**
  
  - [x] 11.4 Crear componentes de integración con Colab
    - Botón "Abrir en Colab"
    - Botón "Importar desde Colab"
    - Modal de confirmación
    - _Requisitos: 37.1, 37.9_

- [x] 12. Sistema de entregas de proyectos
  - [x] 12.1 Implementar modelos de entregas en backend
    - Crear modelo ProjectSubmission (team_id, submission_type, notebook_url, status, grade)
    - Crear modelo SubmissionConfirmation (submission_id, user_id)
    - Implementar lógica de confirmación por todos los miembros
    - _Requisitos: 10.1, 10.2, 10.11_
  
  - [x] 12.2 Implementar integración con Cloudinary
    - Configurar Cloudinary SDK
    - Implementar upload de notebooks
    - Validar formato .ipynb
    - Validar tamaño máximo (10MB)
    - _Requisitos: 10.3, 10.4, 16.1_
  
  - [x] 12.3 Implementar endpoints de entregas
    - POST /api/submissions - Crear entrega
    - POST /api/submissions/{id}/confirm - Confirmar entrega
    - GET /api/submissions/team/{team_id} - Entregas del equipo
    - PUT /api/submissions/{id}/grade - Calificar (profesor)
    - _Requisitos: 10.1, 10.2, 10.11, 10.12_
  
  - [ ]* 12.4 Escribir tests de propiedad para confirmación de entregas
    - **Propiedad 9: Confirmación de Entregas en Equipo**
    - **Valida: Requisito 10.11**
  
  - [ ]* 12.5 Escribir tests de propiedad para validación de formato
    - **Propiedad 12: Validación de Formato de Entrega**
    - **Valida: Requisitos 16.1, 16.2, 16.3**


  - [x] 12.6 Crear interfaz de entregas
    - Formulario de subida de notebook
    - Sistema de confirmación por miembros
    - Vista de entregas del equipo
    - Indicador de estado (pending/confirmed/graded)
    - _Requisitos: 10.1, 10.2, 10.11_

- [x] 13. Sistema de calificaciones
  - [x] 13.1 Implementar modelo de calificaciones
    - Crear modelo Grade (user_id, semester_id, trabajo_1, trabajo_2, concurso, examen, seguimiento)
    - Implementar cálculo automático de calificación final (20% cada componente)
    - Implementar cálculo de seguimiento basado en progreso
    - _Requisitos: 10.18, 35.1, 35.11_
  
  - [x] 13.2 Implementar endpoints de calificaciones
    - GET /api/grades/me - Calificaciones del usuario
    - PUT /api/grades/{user_id} - Actualizar calificaciones (profesor)
    - GET /api/grades/semester/{semester_id} - Todas las calificaciones (profesor)
    - POST /api/grades/calculate-seguimiento - Recalcular seguimiento
    - _Requisitos: 10.18, 35.1, 35.2_
  
  - [ ]* 13.3 Escribir tests de propiedad para cálculo de calificación final
    - **Propiedad 10: Cálculo de Calificación Final Ponderada**
    - **Valida: Requisitos 10.18, 35.11**
  
  - [x] 13.4 Crear interfaz de calificaciones
    - Vista de calificaciones para estudiantes
    - Panel de calificación para profesores
    - Gráfico de distribución de calificaciones
    - _Requisitos: 10.18, 35.1, 35.2_

- [x] 14. Sistema de progreso del estudiante
  - [x] 14.1 Implementar modelo de progreso
    - Crear modelo StudentProgress (user_id, module_id, exercises_completed, exercises_total)
    - Implementar cálculo automático de porcentaje de completación
    - Crear modelo CodeActivity para registrar actividad
    - _Requisitos: 6.4, 35.3, 35.4_
  
  - [x] 14.2 Implementar endpoints de progreso
    - GET /api/progress/me - Progreso del usuario
    - GET /api/progress/module/{module_id} - Progreso en módulo
    - POST /api/progress/activity - Registrar actividad de código
    - _Requisitos: 35.3, 35.4_
  
  - [x] 14.3 Crear componentes de visualización de progreso
    - Barra de progreso por módulo
    - Dashboard de progreso general
    - Indicadores de ejercicios completados
    - _Requisitos: 35.3, 35.4_


- [x] 15. Contenido del Módulo 1: Fundamentos de Python
  - [x] 15.1 Crear lecciones del Módulo 1
    - Lección 1.1: Variables y tipos de datos
    - Lección 1.2: Operadores y expresiones
    - Lección 1.3: Estructuras de control (if, for, while)
    - Lección 1.4: Funciones básicas
    - Incluir ejemplos de código y explicaciones
    - _Requisitos: 17.1, 17.2_
  
  - [x] 15.2 Crear ejercicios del Módulo 1
    - 5-10 ejercicios por lección
    - Incluir casos de prueba automáticos
    - Definir código inicial (starter code)
    - Crear pistas progresivas
    - _Requisitos: 17.1, 17.2_

- [x] 16. Contenido del Módulo 2: Estructuras de Datos
  - [x] 16.1 Crear lecciones del Módulo 2
    - Lección 2.1: Listas y tuplas
    - Lección 2.2: Diccionarios y sets
    - Lección 2.3: Comprensiones de listas
    - Lección 2.4: Manipulación de strings
    - _Requisitos: 18.1, 18.2_
  
  - [x] 16.2 Crear ejercicios del Módulo 2
    - 5-10 ejercicios por lección
    - Incluir casos de prueba
    - Enfoque en manipulación de datos
    - _Requisitos: 18.1, 18.2_

- [x] 17. Contenido del Módulo 3: Introducción a Pandas
  - [x] 17.1 Crear lecciones del Módulo 3
    - Lección 3.1: DataFrames y Series
    - Lección 3.2: Lectura y escritura de datos
    - Lección 3.3: Filtrado y selección
    - Lección 3.4: Operaciones básicas
    - _Requisitos: 19.1, 19.2_
  
  - [x] 17.2 Crear ejercicios del Módulo 3
    - 5-10 ejercicios por lección
    - Usar datasets financieros simples
    - Incluir visualizaciones básicas
    - _Requisitos: 19.1, 19.2_

- [x] 18. Sistema de entrega para Trabajo 1
  - [x] 18.1 Crear especificación del Trabajo 1
    - Definir requisitos del proyecto
    - Crear rúbrica de evaluación
    - Establecer fecha de entrega (semana 6)
    - _Requisitos: 10.1, 10.2, 33.14_
  
  - [x] 18.2 Implementar validación específica para Trabajo 1
    - Validar que incluye análisis de datos con Pandas
    - Validar que incluye al menos 2 visualizaciones
    - Verificar estructura del notebook
    - _Requisitos: 16.1, 16.2, 16.3_


- [x] 19. Checkpoint - Verificar MVP funcional
  - Verificar que todos los componentes del MVP funcionan correctamente
  - Ejecutar suite completa de tests
  - Validar flujo completo: registro → laboratorio → ejercicios → entrega
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas

### Fase 2: Módulos 4-5 y Funcionalidades Avanzadas

- [ ] 20. Proxy backend para yfinance
  - [ ] 20.1 Implementar endpoints de proxy para yfinance
    - POST /api/proxy/yfinance/download - Descargar datos históricos
    - GET /api/proxy/yfinance/info/{ticker} - Información de acción
    - Implementar manejo de errores y retry logic
    - Agregar caching de datos (1 hora)
    - _Requisitos: 20.1, 20.2, 20.3_
  
  - [ ] 20.2 Integrar proxy con Pyodide
    - Modificar Pyodide para usar proxy en lugar de llamadas directas
    - Implementar función helper en Python para llamar al proxy
    - Manejar errores de red
    - _Requisitos: 20.1, 20.2_

- [ ] 21. Contenido del Módulo 4: Obtención de Datos Financieros
  - [ ] 21.1 Crear lecciones del Módulo 4
    - Lección 4.1: Introducción a yfinance
    - Lección 4.2: Descarga de datos históricos
    - Lección 4.3: Información de empresas
    - Lección 4.4: Múltiples activos
    - _Requisitos: 20.1, 20.2_
  
  - [ ] 21.2 Crear ejercicios del Módulo 4
    - Ejercicios de descarga de datos
    - Análisis de precios históricos
    - Comparación de múltiples activos
    - _Requisitos: 20.1, 20.2_

- [ ] 22. Contenido del Módulo 5: Visualización de Datos
  - [ ] 22.1 Crear lecciones del Módulo 5
    - Lección 5.1: Gráficos básicos con matplotlib
    - Lección 5.2: Gráficos financieros (candlestick, OHLC)
    - Lección 5.3: Múltiples subplots
    - Lección 5.4: Personalización de gráficos
    - _Requisitos: 21.1, 21.2_
  
  - [ ] 22.2 Crear ejercicios del Módulo 5
    - Ejercicios de visualización de precios
    - Gráficos de rendimientos
    - Comparación visual de activos
    - _Requisitos: 21.1, 21.2_


- [ ] 23. Sistema de entrega para Trabajo 2
  - [ ] 23.1 Crear especificación del Trabajo 2
    - Definir requisitos (análisis con yfinance + visualizaciones)
    - Crear rúbrica de evaluación
    - Establecer fecha de entrega (semana 11)
    - _Requisitos: 10.1, 10.2, 33.14_
  
  - [ ] 23.2 Implementar validación específica para Trabajo 2
    - Validar uso de yfinance
    - Validar múltiples visualizaciones
    - Verificar análisis financiero
    - _Requisitos: 16.1, 16.2, 16.3_

- [ ] 24. Gamificación básica
  - [ ] 24.1 Implementar sistema de insignias
    - Crear modelo Badge (name, description, criteria, points)
    - Crear modelo UserBadge (user_id, badge_id, earned_at)
    - Definir insignias iniciales (Primera ejecución, 10 ejercicios, etc.)
    - Implementar lógica de otorgamiento automático
    - _Requisitos: 35.5, 35.6_
  
  - [ ] 24.2 Implementar sistema de puntos de experiencia
    - Crear modelo ExperiencePoints (user_id, points, source)
    - Otorgar puntos por ejercicios completados
    - Otorgar puntos por entregas a tiempo
    - Calcular nivel basado en puntos
    - _Requisitos: 35.5, 35.6_
  
  - [ ] 24.3 Crear componentes de gamificación
    - Componente de insignias ganadas
    - Barra de progreso de nivel
    - Animaciones de celebración
    - Notificaciones de logros
    - _Requisitos: 35.5, 35.6_

- [ ] 25. Biblioteca de snippets de código
  - [ ] 25.1 Implementar sistema de snippets
    - Crear modelo CodeSnippet (title, code, category, tags)
    - Implementar búsqueda de snippets
    - Permitir guardar snippets personalizados
    - _Requisitos: 14.1, 14.2_
  
  - [ ] 25.2 Crear interfaz de snippets
    - Panel lateral de snippets
    - Búsqueda y filtrado
    - Inserción con un click
    - _Requisitos: 14.1, 14.2_

- [ ] 26. Checkpoint - Verificar Fase 2 completa
  - Verificar módulos 4-5 funcionando
  - Validar proxy de yfinance
  - Probar sistema de gamificación
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas


### Fase 3: Módulos 6-7 y Análisis Avanzado

- [ ] 27. Contenido del Módulo 6: Análisis Financiero Básico
  - [ ] 27.1 Crear lecciones del Módulo 6
    - Lección 6.1: Rendimientos y volatilidad
    - Lección 6.2: Medias móviles
    - Lección 6.3: Indicadores técnicos básicos
    - Lección 6.4: Correlaciones entre activos
    - _Requisitos: 22.1, 22.2_
  
  - [ ] 27.2 Crear ejercicios del Módulo 6
    - Cálculo de rendimientos
    - Análisis de volatilidad
    - Implementación de indicadores
    - _Requisitos: 22.1, 22.2_

- [ ] 28. Contenido del Módulo 7: Análisis de Portafolios
  - [ ] 28.1 Crear lecciones del Módulo 7
    - Lección 7.1: Construcción de portafolios
    - Lección 7.2: Diversificación
    - Lección 7.3: Frontera eficiente
    - Lección 7.4: Optimización de portafolios
    - _Requisitos: 23.1, 23.2_
  
  - [ ] 28.2 Crear ejercicios del Módulo 7
    - Construcción de portafolios
    - Cálculo de métricas de riesgo
    - Optimización simple
    - _Requisitos: 23.1, 23.2_

- [ ] 29. Panel de comparación Python/R
  - [ ] 29.1 Implementar componente de comparación
    - Crear layout de dos columnas (Python | R)
    - Mostrar código equivalente lado a lado
    - Resaltar diferencias de sintaxis
    - _Requisitos: 36.1, 36.2_
  
  - [ ] 29.2 Crear contenido de comparación
    - Ejemplos de sintaxis básica
    - Comparación de bibliotecas (pandas vs dplyr)
    - Ejemplos de visualización (matplotlib vs ggplot2)
    - _Requisitos: 36.1, 36.2_

- [ ] 30. Visualizaciones interactivas
  - [ ] 30.1 Integrar biblioteca de gráficos interactivos
    - Evaluar Plotly vs Chart.js
    - Implementar gráficos interactivos básicos
    - Permitir zoom y pan en gráficos
    - _Requisitos: 21.3, 21.4_
  
  - [ ] 30.2 Crear componentes de visualización interactiva
    - Gráfico de precios interactivo
    - Selector de rango de fechas
    - Tooltips con información detallada
    - _Requisitos: 21.3, 21.4_


- [ ] 31. Calculadoras financieras
  - [ ] 31.1 Implementar calculadoras básicas
    - Calculadora de rendimientos
    - Calculadora de volatilidad
    - Calculadora de correlación
    - Calculadora de Sharpe ratio
    - _Requisitos: 22.3, 22.4_
  
  - [ ] 31.2 Crear interfaz de calculadoras
    - Componentes de input con validación
    - Visualización de resultados
    - Exportar resultados a código Python
    - _Requisitos: 22.3, 22.4_

- [ ] 32. Sistema completo de calificación
  - [ ] 32.1 Implementar calificación automática de seguimiento
    - Calcular seguimiento basado en ejercicios (40%)
    - Calcular seguimiento basado en actividad (30%)
    - Calcular seguimiento basado en participación (20%)
    - Calcular seguimiento basado en progreso de módulos (10%)
    - _Requisitos: 35.11, 35.12_
  
  - [ ] 32.2 Implementar exportación de calificaciones
    - GET /api/grades/export - Exportar a CSV
    - Incluir todas las componentes de calificación
    - Formato compatible con sistemas institucionales
    - _Requisitos: 35.2_
  
  - [ ] 32.3 Crear panel de calificación avanzado para profesores
    - Vista de todas las calificaciones del semestre
    - Filtros por estudiante, equipo, componente
    - Gráficos de distribución
    - Exportación a CSV
    - _Requisitos: 35.1, 35.2_

- [ ] 33. Checkpoint - Verificar Fase 3 completa
  - Verificar módulos 6-7 funcionando
  - Probar panel de comparación Python/R
  - Validar calculadoras financieras
  - Probar sistema completo de calificación
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas

### Fase 4: Módulo 8 y Funcionalidades Avanzadas

- [ ] 34. Contenido del Módulo 8: Proyecto Final
  - [ ] 34.1 Crear especificación del proyecto final
    - Definir alcance del proyecto
    - Crear rúbrica detallada
    - Establecer hitos intermedios
    - _Requisitos: 24.1, 24.2_
  
  - [ ] 34.2 Crear guías y recursos para proyecto final
    - Guía de estructura del proyecto
    - Ejemplos de proyectos anteriores
    - Checklist de requisitos
    - _Requisitos: 24.1, 24.2_


- [ ] 35. Sistema de evaluaciones ECAES
  - [ ] 35.1 Implementar modelo de evaluaciones
    - Crear modelo Evaluation (title, questions, time_limit, semester_id)
    - Crear modelo EvaluationSubmission (user_id, evaluation_id, answers, score)
    - Implementar timer de evaluación
    - _Requisitos: 25.1, 25.2_
  
  - [ ] 35.2 Implementar endpoints de evaluaciones
    - GET /api/evaluations - Listar evaluaciones disponibles
    - POST /api/evaluations/{id}/start - Iniciar evaluación
    - POST /api/evaluations/{id}/submit - Enviar respuestas
    - GET /api/evaluations/{id}/results - Ver resultados
    - _Requisitos: 25.1, 25.2_
  
  - [ ] 35.3 Crear interfaz de evaluaciones
    - Vista de evaluación con timer
    - Preguntas de opción múltiple
    - Preguntas de código
    - Envío automático al terminar tiempo
    - _Requisitos: 25.1, 25.2_

- [ ] 36. Sistema avanzado de seguimiento de progreso
  - [ ] 36.1 Implementar métricas avanzadas de progreso
    - Tiempo total en plataforma
    - Frecuencia de uso
    - Racha de días consecutivos
    - Velocidad de completación de ejercicios
    - _Requisitos: 35.3, 35.4_
  
  - [ ] 36.2 Crear dashboard avanzado de progreso
    - Gráficos de actividad temporal
    - Heatmap de actividad
    - Comparación con promedio del curso
    - Predicción de calificación final
    - _Requisitos: 35.3, 35.4_

- [ ] 37. Modo de vista previa en vivo
  - [ ] 37.1 Implementar ejecución automática al escribir
    - Debouncing de ejecución (500ms)
    - Indicador de ejecución en progreso
    - Cancelación de ejecución anterior
    - _Requisitos: 5.4_
  
  - [ ] 37.2 Crear toggle de modo preview
    - Botón de activar/desactivar
    - Guardar preferencia en localStorage
    - Indicador visual de modo activo
    - _Requisitos: 5.4_


- [ ] 38. Depurador visual
  - [ ] 38.1 Implementar depurador básico
    - Visualización de variables en scope
    - Ejecución paso a paso
    - Breakpoints en código
    - _Requisitos: 5.5_
  
  - [ ] 38.2 Crear interfaz de depurador
    - Panel de variables
    - Controles de depuración (step, continue, stop)
    - Resaltado de línea actual
    - _Requisitos: 5.5_

- [ ] 39. Quizzes interactivos
  - [ ] 39.1 Implementar sistema de quizzes
    - Crear modelo Quiz (module_id, questions, points)
    - Crear modelo QuizSubmission (user_id, quiz_id, answers, score)
    - Implementar calificación automática
    - _Requisitos: 26.1, 26.2_
  
  - [ ] 39.2 Crear interfaz de quizzes
    - Componente de pregunta de opción múltiple
    - Componente de pregunta de código
    - Feedback inmediato
    - Resumen de resultados
    - _Requisitos: 26.1, 26.2_

- [ ] 40. Navegador de documentación
  - [ ] 40.1 Integrar documentación de bibliotecas
    - Documentación de Python estándar
    - Documentación de pandas
    - Documentación de matplotlib
    - Documentación de yfinance
    - _Requisitos: 27.1, 27.2_
  
  - [ ] 40.2 Crear componente de navegador de docs
    - Búsqueda de funciones
    - Vista de documentación inline
    - Ejemplos de uso
    - _Requisitos: 27.1, 27.2_

- [ ] 41. Tutoriales en video
  - [ ] 41.1 Integrar reproductor de video
    - Integrar con YouTube o Vimeo
    - Implementar controles personalizados
    - Sincronizar video con código
    - _Requisitos: 28.1, 28.2_
  
  - [ ] 41.2 Crear contenido de video
    - Videos introductorios por módulo
    - Videos de conceptos difíciles
    - Videos de resolución de ejercicios
    - _Requisitos: 28.1, 28.2_


- [ ] 42. Mini-desafíos diarios
  - [ ] 42.1 Implementar sistema de desafíos
    - Crear modelo DailyChallenge (date, problem, solution, points)
    - Crear modelo ChallengeSubmission (user_id, challenge_id, code, solved)
    - Generar desafío diario automáticamente
    - _Requisitos: 29.1, 29.2_
  
  - [ ] 42.2 Crear interfaz de desafíos
    - Notificación de nuevo desafío
    - Vista de desafío del día
    - Historial de desafíos
    - Tabla de clasificación
    - _Requisitos: 29.1, 29.2_

- [ ] 43. Animaciones y transiciones
  - [ ] 43.1 Implementar animaciones de UI
    - Transiciones suaves entre paneles
    - Animaciones de carga
    - Animaciones de éxito/error
    - Efectos de hover y focus
    - _Requisitos: 30.1, 30.2_
  
  - [ ] 43.2 Implementar animaciones de celebración
    - Confetti al completar ejercicio
    - Animación de insignia ganada
    - Animación de nivel subido
    - _Requisitos: 30.1, 30.2, 35.6_

- [ ] 44. Playground de código
  - [ ] 44.1 Crear modo playground
    - Entorno de código sin restricciones
    - Guardar múltiples snippets
    - Compartir código con URL
    - _Requisitos: 31.1, 31.2_
  
  - [ ] 44.2 Crear interfaz de playground
    - Editor sin ejercicios
    - Biblioteca de snippets guardados
    - Botón de compartir
    - _Requisitos: 31.1, 31.2_

- [ ] 45. Optimizaciones de rendimiento
  - [ ] 45.1 Implementar optimizaciones de frontend
    - Code splitting de componentes pesados
    - Lazy loading de módulos
    - Caching de Pyodide en Service Worker
    - Optimización de imágenes
    - _Requisitos: 3.1, 3.2_
  
  - [ ] 45.2 Implementar optimizaciones de backend
    - Caching de datos financieros (1 hora)
    - Query optimization con índices
    - Compresión de respuestas (GZip)
    - Rate limiting
    - _Requisitos: 3.1, 3.2_


- [ ] 46. Seguridad y validación
  - [ ] 46.1 Implementar medidas de seguridad
    - Rate limiting en endpoints críticos
    - Validación de inputs con Pydantic
    - Sanitización de código Python
    - Encriptación de tokens de GitHub
    - _Requisitos: 1.1, 1.2, 2.1_
  
  - [ ] 46.2 Implementar CORS y CSP
    - Configurar CORS restrictivo
    - Configurar Content Security Policy
    - Headers de seguridad (X-Frame-Options, etc.)
    - _Requisitos: 3.1, 3.2_
  
  - [ ]* 46.3 Escribir tests de propiedad para serialización de notebooks
    - **Propiedad 11: Round-Trip de Serialización de Notebooks**
    - **Valida: Requisitos 15.1, 15.2, 15.5**

- [ ] 47. Testing y calidad de código
  - [ ]* 47.1 Escribir tests unitarios de backend
    - Tests de endpoints de autenticación
    - Tests de lógica de equipos
    - Tests de cálculo de calificaciones
    - Tests de validación de entregas
  
  - [ ]* 47.2 Escribir tests unitarios de frontend
    - Tests de componentes de UI
    - Tests de hooks personalizados
    - Tests de utilidades
  
  - [ ]* 47.3 Escribir tests de integración
    - Test de flujo completo de registro
    - Test de flujo de entrega en equipo
    - Test de ejecución de código
    - Test de calificación automática
  
  - [ ]* 47.4 Escribir tests E2E
    - Test de navegación completa
    - Test de laboratorio interactivo
    - Test de sistema de ejercicios
    - Test de entregas

- [ ] 48. Deployment y configuración
  - [ ] 48.1 Configurar deployment de frontend en Vercel
    - Crear proyecto en Vercel
    - Configurar variables de entorno
    - Configurar dominio personalizado
    - Configurar deploy automático desde Git
    - _Requisitos: 3.1, 3.2_
  
  - [ ] 48.2 Configurar deployment de backend en Railway/Render
    - Crear proyecto en Railway o Render
    - Configurar Dockerfile
    - Configurar variables de entorno
    - Configurar health checks
    - _Requisitos: 3.1, 3.2_
  
  - [ ] 48.3 Configurar servicios externos
    - Configurar Cloudinary para almacenamiento
    - Configurar SendGrid/Resend para emails
    - Configurar GitHub OAuth App
    - Verificar límites de free tier
    - _Requisitos: 3.3, 10.3, 34.1_


- [ ] 49. Monitoreo y observabilidad
  - [ ] 49.1 Configurar logging
    - Logging estructurado en backend
    - Logging de errores en frontend
    - Logging de métricas de uso
    - _Requisitos: 3.1, 3.2_
  
  - [ ] 49.2 Configurar monitoreo
    - Vercel Analytics para frontend
    - Railway/Render metrics para backend
    - Supabase dashboard para base de datos
    - Alertas de errores críticos
    - _Requisitos: 3.1, 3.2_

- [ ] 50. Documentación
  - [ ] 50.1 Crear documentación técnica
    - README con instrucciones de setup
    - Documentación de API (OpenAPI/Swagger)
    - Guía de contribución
    - Arquitectura del sistema
  
  - [ ] 50.2 Crear documentación de usuario
    - Guía de inicio rápido para estudiantes
    - Manual de administración para profesores
    - FAQ
    - Tutoriales en video

- [ ] 51. Checkpoint final - Verificar sistema completo
  - Ejecutar suite completa de tests (unitarios, integración, E2E)
  - Verificar todas las funcionalidades en ambiente de producción
  - Validar límites de free tier y uso de recursos
  - Realizar pruebas de carga con usuarios simulados
  - Verificar accesibilidad y responsive design
  - Asegurar que todos los tests pasan, preguntar al usuario si surgen dudas

## Notas Importantes

### Sobre las Tareas Opcionales (marcadas con *)

Las tareas marcadas con asterisco (*) son opcionales y pueden omitirse para acelerar el desarrollo del MVP. Estas incluyen principalmente:
- Tests de propiedad (property-based tests)
- Tests unitarios adicionales
- Tests de integración
- Tests E2E

Sin embargo, se recomienda implementarlas para garantizar la calidad y corrección del sistema.

### Sobre las Propiedades de Corrección

Cada test de propiedad referencia una propiedad específica del documento de diseño y valida uno o más requisitos. Las propiedades son:

1. Validación de Correo Institucional (Requisitos 1.1, 1.2)
2. Validación de CSV de Invitaciones (Requisitos 2.2, 2.3)
3. Registro con Invitación Válida (Requisito 2.6)
4. Tiempo de Ejecución de Código (Requisito 5.2)
5. Reporte de Errores de Sintaxis (Requisito 5.3)
6. Validación Automática de Ejercicios (Requisito 6.3)
7. Actualización de Progreso (Requisito 6.4)
8. Límites de Tamaño de Equipo (Requisitos 9.6, 9.7)
9. Confirmación de Entregas en Equipo (Requisito 10.11)
10. Cálculo de Calificación Final Ponderada (Requisitos 10.18, 35.11)
11. Round-Trip de Serialización de Notebooks (Requisitos 15.1, 15.2, 15.5)
12. Validación de Formato de Entrega (Requisitos 16.1, 16.2, 16.3)
13. Validación de Duración de Semestre (Requisito 33.3)
14. Cálculo de Fechas de Entrega (Requisito 33.14)
15. Round-Trip de Integración con Google Colab (Requisitos 37.3, 37.9, 37.20)


### Sobre los Checkpoints

Los checkpoints están distribuidos estratégicamente al final de cada fase para:
- Validar que todas las funcionalidades de la fase funcionan correctamente
- Ejecutar tests y verificar que pasan
- Identificar problemas antes de avanzar a la siguiente fase
- Permitir al usuario revisar el progreso y hacer ajustes

### Estrategia de Implementación

1. **Incremental**: Cada tarea construye sobre las anteriores
2. **Validación temprana**: Los tests se ejecutan cerca de la implementación
3. **Checkpoints frecuentes**: Validación al final de cada fase
4. **Enfoque en MVP**: Fase 1 contiene todas las funcionalidades críticas
5. **Expansión progresiva**: Fases 2-4 agregan funcionalidades avanzadas

### Contexto Disponible Durante Implementación

Durante la implementación de cada tarea, se asume que el agente tiene acceso a:
- Documento de requisitos completo
- Documento de diseño técnico completo
- Este plan de tareas
- Código implementado en tareas anteriores

Por lo tanto, las tareas no incluyen detalles de implementación excesivos que ya están en el diseño.

### Tecnologías y Bibliotecas Clave

**Frontend:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Monaco Editor (@monaco-editor/react)
- Pyodide (v0.24.1+)
- Tailwind CSS
- fast-check (property-based testing)

**Backend:**
- FastAPI
- SQLAlchemy
- Pydantic
- yfinance
- hypothesis (property-based testing)
- pytest

**Infraestructura:**
- Supabase (PostgreSQL + Auth)
- Cloudinary (almacenamiento)
- Vercel (frontend hosting)
- Railway/Render (backend hosting)

### Estimación de Esfuerzo

- **Fase 1 (MVP)**: ~40-50 horas de desarrollo
- **Fase 2**: ~20-25 horas de desarrollo
- **Fase 3**: ~20-25 horas de desarrollo
- **Fase 4**: ~30-35 horas de desarrollo
- **Total**: ~110-135 horas de desarrollo

### Orden de Prioridad

Si se necesita reducir el alcance, las fases tienen la siguiente prioridad:

1. **Crítico (Fase 1)**: MVP funcional con módulos 1-3
2. **Alta (Fase 2)**: Módulos 4-5 con datos financieros reales
3. **Media (Fase 3)**: Análisis avanzado y herramientas adicionales
4. **Baja (Fase 4)**: Funcionalidades nice-to-have

## Conclusión

Este plan de implementación proporciona una ruta clara y estructurada para construir la Plataforma Educativa de Python para Análisis Financiero. Siguiendo el enfoque incremental de 4 fases, se puede entregar valor temprano con el MVP y expandir funcionalidad progresivamente.

Cada tarea está diseñada para ser discreta, manejable y construir sobre las anteriores. Los checkpoints aseguran validación continua, y las referencias a requisitos mantienen trazabilidad completa.

El sistema resultante será una plataforma educativa moderna, escalable y optimizada para usar servicios gratuitos, capaz de soportar 30-50 estudiantes concurrentes por semestre.
