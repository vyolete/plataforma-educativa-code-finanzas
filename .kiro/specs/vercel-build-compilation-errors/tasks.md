# Tasks

## Task 1: Actualizar componentes para usar API de Supabase
**Status**: pending
**Assignee**: unassigned
**Depends On**: none

### Description
Cambiar ContentPanel.tsx y ExercisesPanel.tsx para que usen la API en lugar de imports estáticos. Crear el archivo exercises.ts para las llamadas a la API.

### Acceptance Criteria
- [ ] ContentPanel.tsx usa API calls para obtener contenido de lecciones
- [ ] ExercisesPanel.tsx usa API calls para obtener ejercicios
- [ ] Crear frontend/src/lib/api/exercises.ts con funciones para llamar a la API
- [ ] Agregar estados de loading en ambos componentes
- [ ] Agregar manejo de errores para requests fallidos
- [ ] Mantener toda la funcionalidad actual (markdown, navegación, badges, etc.)
- [ ] No importar datos estáticos de lecciones/ejercicios en estos componentes

### Technical Notes
- Usar los endpoints existentes `/api/lessons` y `/api/exercises`
- Implementar loading skeletons apropiados
- Mantener compatibilidad con la estructura actual de lessons/exercises

---

## Task 2: Crear configuración de Next.js para optimizar builds
**Status**: pending
**Assignee**: unassigned
**Depends On**: Task 1

### Description
Crear next.config.js con optimizaciones webpack para excluir archivos estáticos grandes del bundle y reducir el tiempo de build.

### Acceptance Criteria
- [ ] Crear next.config.js con configuración webpack
- [ ] Excluir archivos estáticos grandes (lessons.ts, exercises.ts, etc.) del bundle
- [ ] Reducir tiempo de build a menos de 3 minutos
- [ ] Build completa exitosamente en Vercel
- [ ] La funcionalidad de la aplicación no se ve afectada

### Technical Notes
- Usar webpack IgnorePlugin para excluir archivos de datos estáticos
- Probar build localmente con `npm run build` antes de deploy
- Documentar decisiones de configuración en comentarios

---

## Task 3: Agregar timeout de 30 segundos al worker de Pyodide
**Status**: pending
**Assignee**: unassigned
**Depends On**: none

### Description
Modificar pyodide.worker.ts para implementar un timeout de 30 segundos usando Promise.race() que retorne mensaje de error cuando se exceda el tiempo.

### Acceptance Criteria
- [ ] Implementar timeout usando Promise.race() en pyodide.worker.ts
- [ ] Timeout configurado a 30 segundos
- [ ] Retornar mensaje de error claro cuando se exceda el timeout
- [ ] Worker puede ser terminado y reiniciado después del timeout
- [ ] Probar con código infinito como `while True: pass`
- [ ] Ejecución normal de código no se ve afectada

### Technical Notes
- Retornar respuesta de error estructurada: `{ error: "Execution timeout: Code took longer than 30 seconds" }`
- Asegurar limpieza del worker para prevenir memory leaks
