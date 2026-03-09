# Notas de Deploy - MVP Vercel

## Fecha
Marzo 8, 2026

## Cambios Implementados

### 1. Migración a API de Supabase

**Objetivo**: Eliminar imports estáticos de datos grandes que bloqueaban el build de Vercel.

**Archivos Creados**:
- `frontend/src/lib/api/exercises.ts` - Cliente API para ejercicios

**Archivos Modificados**:
- `frontend/src/components/laboratory/ContentPanel.tsx` - Usa API de lessons
- `frontend/src/components/laboratory/ExercisesPanel.tsx` - Usa API de exercises
- `frontend/src/contexts/ExerciseContext.tsx` - Import actualizado

**Estado**: Los componentes están preparados para usar la API. Temporalmente usan datos mock para permitir el build.

### 2. Optimización de Build (next.config.js)

**Archivo Creado**: `frontend/next.config.js`

**Optimizaciones**:
- SWC minification habilitado
- Console.log removido en producción (excepto error/warn)
- Source maps deshabilitados en producción
- Optimización de imports para Monaco Editor y React Markdown

**Impacto Esperado**: Reducción de 30-40% en tiempo de build y tamaño de bundle.

### 3. Timeout de Pyodide (30 segundos)

**Archivo Modificado**: `frontend/src/workers/pyodide.worker.ts`

**Cambios**:
- Constante `EXECUTION_TIMEOUT = 30000` ms
- `Promise.race()` entre ejecución y timeout
- Mensaje de error claro para estudiantes
- Limpieza del worker después del timeout

**Beneficio**: Protege a los estudiantes de código infinito que congela el navegador.

## Estado de la Migración de Datos

### ✅ Completado
- **Lessons**: 11 lecciones migradas a Supabase (Módulos 1-3)
- **API Backend**: Endpoints `/api/lessons` funcionando
- **Cliente Frontend**: `frontend/src/lib/api/lessons.ts` creado

### ⏳ Pendiente
- **Exercises**: Aún en archivos estáticos (se migrará después del MVP)
- **API Backend**: Endpoints `/api/exercises` por implementar
- **Conexión Real**: Componentes usan mock temporalmente

## Instrucciones de Deploy en Vercel

### Pre-requisitos
1. Cuenta de Vercel conectada a GitHub
2. Variables de entorno configuradas en Vercel:
   ```
   NEXT_PUBLIC_API_URL=https://tu-backend.railway.app
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
   ```

### Pasos para Deploy

1. **Commit y Push**:
   ```bash
   git add .
   git commit -m "feat: MVP optimizations for Vercel deploy
   
   - Add API clients for lessons and exercises
   - Implement 30s timeout for Pyodide worker
   - Add next.config.js with build optimizations
   - Update components to use API (with mock fallback)"
   
   git push origin main
   ```

2. **Configurar Vercel**:
   - Ir a https://vercel.com
   - Import Git Repository
   - Seleccionar el repositorio
   - Framework Preset: Next.js
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Variables de Entorno**:
   Agregar en Vercel Dashboard → Settings → Environment Variables

4. **Deploy**:
   - Click "Deploy"
   - Esperar ~3-5 minutos
   - Verificar que el build complete exitosamente

### Post-Deploy

1. **Verificar Funcionalidad Básica**:
   - [ ] Login funciona
   - [ ] Registro funciona
   - [ ] Página de laboratorio carga
   - [ ] Editor de código funciona
   - [ ] Pyodide ejecuta código Python
   - [ ] Timeout de 30s funciona con `while True: pass`

2. **Conectar API Real** (siguiente fase):
   - Descomentar llamadas a API en ContentPanel.tsx
   - Descomentar llamadas a API en ExercisesPanel.tsx
   - Implementar endpoints de exercises en backend
   - Migrar exercises a Supabase

## Archivos Clave Modificados

```
frontend/
├── next.config.js                              [NUEVO]
├── src/
│   ├── lib/
│   │   └── api/
│   │       └── exercises.ts                    [NUEVO]
│   ├── components/
│   │   └── laboratory/
│   │       ├── ContentPanel.tsx                [MODIFICADO]
│   │       └── ExercisesPanel.tsx              [MODIFICADO]
│   ├── contexts/
│   │   └── ExerciseContext.tsx                 [MODIFICADO]
│   └── workers/
│       └── pyodide.worker.ts                   [MODIFICADO]
```

## Métricas Esperadas

### Build Performance
- Tiempo de build: < 3 minutos (antes: >5 minutos o timeout)
- Bundle size: ~2MB sin Pyodide (antes: ~3MB)
- Vercel deploy: Exitoso (antes: Fallaba)

### Runtime Performance
- Pyodide load: ~10 segundos (primera vez)
- Code execution: <5 segundos (código normal)
- Timeout protection: 30 segundos (código infinito)
- API response: <500ms (cuando esté conectada)

## Problemas Conocidos y Soluciones

### 1. Componentes muestran "No hay ejercicios disponibles"
**Causa**: API de exercises no implementada aún
**Solución**: Implementar endpoints en backend y descomentar llamadas en frontend

### 2. Lecciones muestran contenido de ejemplo
**Causa**: Usando mock temporal para permitir build
**Solución**: Descomentar llamadas a API de lessons en ContentPanel.tsx

### 3. Build local tarda mucho
**Causa**: Next.js procesa muchos archivos en desarrollo
**Solución**: Normal en desarrollo. En Vercel será más rápido.

## Próximos Pasos (Post-MVP)

1. **Fase 2: Migración Completa de Exercises**
   - Crear schema en Supabase
   - Migrar datos de exercises.ts
   - Implementar API backend
   - Conectar frontend

2. **Fase 3: Optimizaciones de Performance**
   - Service Worker para cachear Pyodide
   - Keep-alive para backend (evitar cold starts)
   - Lazy loading de componentes pesados

3. **Fase 4: Contenido Adicional**
   - Módulos 4-8
   - Más ejercicios
   - Gamificación completa

## Contacto y Soporte

Si hay problemas durante el deploy:
1. Verificar logs en Vercel Dashboard
2. Verificar variables de entorno
3. Verificar que el backend esté corriendo
4. Revisar este documento para troubleshooting

---

**Última actualización**: Marzo 8, 2026
**Versión**: MVP 1.0
**Estado**: Listo para deploy en Vercel
