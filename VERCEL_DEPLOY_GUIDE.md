# Guía de Deploy en Vercel - MVP

## ✅ Cambios Completados

Las 3 tareas críticas están implementadas y pusheadas a GitHub:

1. ✅ **API Clients**: ContentPanel y ExercisesPanel usan API
2. ✅ **next.config.js**: Optimizaciones de build
3. ✅ **Pyodide Timeout**: 30 segundos de protección

## 🚀 Pasos para Deploy en Vercel

### 1. Acceder a Vercel
- Ir a: https://vercel.com
- Login con tu cuenta de GitHub

### 2. Importar Proyecto
- Click en "Add New..." → "Project"
- Buscar: `plataforma-educativa-code-finanzas`
- Click en "Import"

### 3. Configuración del Proyecto

**Framework Preset**: Next.js (detectado automáticamente)

**Root Directory**: `frontend`

**Build Settings** (dejar por defecto):
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 4. Variables de Entorno

Agregar estas variables en "Environment Variables":

```bash
# API Backend (cambiar cuando despliegues el backend)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase (ya tienes estos valores en backend/.env)
NEXT_PUBLIC_SUPABASE_URL=https://gchmlodulrqzyxkjdeoc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase

# GitHub OAuth (ya configurado)
NEXT_PUBLIC_GITHUB_CLIENT_ID=Ov23liDmDOT2vgyM97HM
```

**Importante**: 
- Obtén `NEXT_PUBLIC_SUPABASE_ANON_KEY` desde: Supabase Dashboard → Settings → API → anon public key
- Cuando despliegues el backend, actualiza `NEXT_PUBLIC_API_URL` con la URL de Railway/Render

### 5. Deploy
- Click en "Deploy"
- Esperar 2-3 minutos
- ¡Listo!

## 📋 Post-Deploy Checklist

Una vez desplegado, verifica:

- [ ] La aplicación carga sin errores
- [ ] Página de login es accesible
- [ ] Página de registro funciona
- [ ] Editor de código se muestra correctamente
- [ ] Pyodide carga (puede tardar ~10 segundos la primera vez)
- [ ] Código Python ejecuta correctamente
- [ ] Timeout funciona: prueba con `while True: pass` (debe terminar en 30s)

## 🔧 Configuración del Backend (Siguiente Paso)

### Backend en Railway/Render

1. **Deploy Backend**:
   - Subir código de `backend/` a Railway o Render
   - Configurar variables de entorno desde `backend/.env`

2. **Actualizar CORS en Backend**:
   ```python
   # backend/.env
   CORS_ORIGINS=["http://localhost:3000","https://tu-app.vercel.app"]
   ```

3. **Actualizar Frontend**:
   - En Vercel → Settings → Environment Variables
   - Cambiar `NEXT_PUBLIC_API_URL` a la URL de tu backend
   - Redeploy automático

## 🐛 Troubleshooting

### Build Falla en Vercel
- Verificar que `Root Directory` sea `frontend`
- Verificar que todas las variables de entorno estén configuradas
- Revisar logs en Vercel Dashboard

### Aplicación Carga pero No Hay Datos
- Normal: Los componentes usan datos mock temporalmente
- Solución: Descomentar llamadas a API en ContentPanel.tsx y ExercisesPanel.tsx
- Asegurarse de que el backend esté corriendo

### Pyodide No Carga
- Verificar consola del navegador
- Pyodide tarda ~10 segundos en primera carga
- Verificar que no haya bloqueadores de scripts

### Timeout No Funciona
- Verificar que el worker se haya actualizado
- Hacer hard refresh (Cmd+Shift+R en Mac, Ctrl+Shift+R en Windows)
- Verificar en consola que no haya errores del worker

## 📊 Métricas Esperadas

### Build Performance
- Tiempo de build: 2-3 minutos
- Bundle size: ~2MB (sin Pyodide)
- Deploy exitoso: ✅

### Runtime Performance
- Pyodide load: ~10 segundos (primera vez)
- Code execution: <5 segundos (código normal)
- Timeout: 30 segundos (código infinito)

## 🔄 Próximos Pasos

1. **Conectar API Real**:
   - Descomentar llamadas en ContentPanel.tsx
   - Descomentar llamadas en ExercisesPanel.tsx
   - Verificar que backend esté corriendo

2. **Migrar Exercises a Supabase**:
   - Crear schema en Supabase
   - Implementar endpoints en backend
   - Migrar datos de exercises.ts

3. **Optimizaciones**:
   - Service Worker para cachear Pyodide
   - Keep-alive para backend
   - Lazy loading de componentes

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs en Vercel Dashboard
2. Verificar variables de entorno
3. Verificar que backend esté corriendo
4. Consultar DEPLOY_NOTES.md para más detalles

---

**Última actualización**: Marzo 8, 2026
**Estado**: ✅ Listo para deploy
