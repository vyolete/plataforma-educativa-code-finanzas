# Vercel Build Compilation Errors - Bugfix Design

## Overview

This bugfix addresses a critical deployment blocker where duplicate constant definitions in `lessons.ts` prevent Vercel builds from completing. The immediate fix removes the duplicate definition, but this document also designs solutions for 4 additional architectural blockers that impact production readiness: Python execution timeouts, Pyodide caching, backend cold starts, and content migration to database.

The fix strategy is phased:
- Phase 1: Emergency fix for duplicate definition (unblocks deployment)
- Phase 2: Build optimizations via Next.js configuration
- Phase 3: Python execution timeout protection (critical for student safety)
- Phase 4: Service Worker for Pyodide caching (10s → <1s load time)
- Phase 5: Backend keep-alive during class hours (eliminates cold starts)
- Phase 6: Content migration to Supabase (architectural correctness)

## Glossary

- **Bug_Condition (C)**: Webpack encounters duplicate `const allLessons` definitions during build compilation
- **Property (P)**: Build completes successfully without duplicate definition errors
- **Preservation**: All lesson data access patterns, exports, and runtime behavior remain unchanged
- **allLessons**: Array combining all lesson objects from different modules
- **sampleLessonsBase**: Base array of lessons from Modules 1-2
- **module3Lessons**: Array of lessons from Module 3
- **Pyodide**: WebAssembly Python runtime that executes in browser
- **Service Worker**: Browser API for intercepting network requests and caching resources
- **Cold Start**: Delay when backend wakes from sleep on free-tier hosting (30-60 seconds)
- **Web Worker**: Separate JavaScript thread for running code without blocking UI

## Bug Details

### Fault Condition

The build fails when webpack processes `frontend/src/data/lessons.ts` and encounters a duplicate constant definition. Based on the bugfix requirements, there should be two definitions at lines 2648 and 2660, but current grep search only found one at line 2648.

**Formal Specification:**
```
FUNCTION isBugCondition(buildContext)
  INPUT: buildContext containing file AST and symbol table
  OUTPUT: boolean
  
  file := buildContext.getFile('frontend/src/data/lessons.ts')
  allLessonsDefinitions := file.findAllDeclarations('allLessons')
  
  RETURN allLessonsDefinitions.length > 1
         OR (allLessonsDefinitions.length == 1 
             AND allLessonsDefinitions[0].references('sampleLessons')
             AND NOT exists('sampleLessons' in file.exports))
END FUNCTION
```


### Examples

**Example 1: Duplicate Definition (Primary Bug)**
- Input: `lessons.ts` with two `const allLessons = ...` statements
- Expected: Build completes successfully with single definition
- Actual: Webpack error "the name `allLessons` is defined multiple times"

**Example 2: Undefined Reference**
- Input: `const allLessons = [...sampleLessons, ...]` where `sampleLessons` is not yet defined
- Expected: Build completes with correct reference to `sampleLessonsBase`
- Actual: Webpack error "Cannot find name 'sampleLessons'"

**Example 3: Infinite Python Loop (Related Critical Issue)**
- Input: Student writes `while True: pass` in code editor
- Expected: Execution terminates after 30 seconds with timeout error
- Actual: Browser tab freezes indefinitely, student loses all work

**Example 4: Pyodide Reload on Every Visit**
- Input: Student closes browser and returns to platform next day
- Expected: Pyodide loads from cache in <1 second
- Actual: 5-10 MB download takes 10 seconds every time

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**
- `getLessonById()` must continue returning correct lesson objects
- `getLessonsByModule()` must continue returning filtered and sorted lessons
- `sampleLessons` export must continue providing access to all lessons
- Development mode hot reloading must continue working
- All lesson content must remain accessible with identical IDs and structure
- Student progress tracking must continue working with existing lesson references
- Professor dashboard must continue displaying correct lesson completion data

**Scope:**
All code that imports and uses lesson data should be completely unaffected by this fix. This includes:
- Laboratory components that display lesson content
- Progress tracking that references lesson IDs
- Navigation components that list lessons by module
- Exercise components that link to specific lessons

## Hypothesized Root Cause

Based on the bug description and code analysis, the issues are:

### Phase 1: Duplicate Definition (Immediate Blocker)

**Root Cause**: According to bugfix.md, there are two `const allLessons` definitions:
- Line 2648: `const allLessons = [...sampleLessons, ...module3Lessons];` (incorrect - references undefined variable)
- Line 2660: `const allLessons = [...sampleLessonsBase, ...module3Lessons];` (correct)

However, current grep search only found one definition at line 2648. This suggests either:
1. The duplicate was already partially fixed but the wrong line was kept
2. The line numbers in bugfix.md are outdated
3. The file has been modified since bugfix.md was written

**Most Likely**: Line 2648 references `sampleLessons` (which doesn't exist) instead of `sampleLessonsBase`, causing a reference error that blocks the build.


### Phase 2: Build Performance (Optimization)

**Root Cause**: Next.js default configuration doesn't optimize for large static content files
- No explicit SWC compiler configuration
- Default code splitting may not be optimal for 2660+ line data files
- No tree shaking configuration for unused lesson data
- Missing production optimizations

### Phase 3: Python Execution Timeout (Critical Safety Issue)

**Root Cause**: Web Workers cannot be terminated from outside by default
- Current `pyodide.worker.ts` has no timeout mechanism
- `executeCode()` is async but has no time limit
- Infinite loops block the worker thread indefinitely
- No way to kill the worker and restart it

**Technical Challenge**: JavaScript's `Worker.terminate()` kills the worker immediately, but:
- Pyodide takes 5-10 seconds to reload after termination
- Student loses their code execution context
- Need graceful timeout that preserves worker when possible

### Phase 4: Pyodide Caching (Performance Issue)

**Root Cause**: No Service Worker to cache Pyodide assets
- Pyodide consists of ~5-10 MB of WebAssembly and JavaScript files
- Browser's HTTP cache is unreliable (can be cleared, has size limits)
- CDN files are fetched fresh on each browser session
- 30 students loading simultaneously during class creates bandwidth spike

**Technical Solution**: Service Worker with Cache API provides:
- Persistent cache that survives browser restarts
- Programmatic control over cache invalidation
- Ability to serve cached files instantly
- Version management for Pyodide updates

### Phase 5: Backend Cold Starts (Class Disruption)

**Root Cause**: Railway/Render free tier sleeps after 15 minutes of inactivity
- Backend goes to sleep between classes
- First API request during class takes 30-60 seconds to wake up
- Affects first student who tries to submit work or fetch data
- Creates poor experience during live instruction (Tue/Thu 6-8 PM)

**Technical Solution**: Ping backend every 14 minutes, but only during class hours
- Prevents sleep without wasting resources 24/7
- Respects free tier limits (not abuse)
- Targets specific time windows when students are active

### Phase 6: Content in Code (Architectural Debt)

**Root Cause**: Educational content stored in TypeScript instead of database
- 2660+ lines of lesson data in `lessons.ts`
- Webpack must parse and bundle all content on every build
- Content changes require full redeployment (5-10 minutes)
- Professors cannot edit lessons without developer access
- Not scalable as course content grows

**Correct Architecture**: Content should live in Supabase
- Lessons stored as database rows
- Frontend fetches via API at runtime
- Content updates are instant (no redeployment)
- Build time independent of content volume
- Professors can edit via admin interface


## Correctness Properties

Property 1: Fault Condition - Build Compilation Success

_For any_ Next.js build process that compiles `frontend/src/data/lessons.ts`, the build SHALL complete successfully without duplicate definition errors, producing a deployable artifact that passes all webpack compilation checks.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Lesson Data Access

_For any_ code that imports and uses lesson data (via `getLessonById`, `getLessonsByModule`, or `sampleLessons` export), the fixed code SHALL produce exactly the same lesson objects with identical IDs, content, and structure as before the fix, preserving all existing functionality.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

Property 3: Python Execution Safety (Phase 3)

_For any_ Python code executed in the Pyodide worker that runs longer than 30 seconds, the execution SHALL be terminated with a timeout error message, and the worker SHALL be restarted to allow subsequent code execution without requiring page reload.

**Validates: Requirements 2.4 (implicit - student safety)**

Property 4: Pyodide Load Performance (Phase 4)

_For any_ browser session after the first visit, Pyodide assets SHALL load from Service Worker cache in under 1 second, reducing the 10-second initial load time by 90% for returning users.

**Validates: Requirements 2.5 (implicit - performance targets)**

Property 5: Backend Availability During Class (Phase 5)

_For any_ API request made during class hours (Tuesdays and Thursdays 6:00-8:00 PM Colombia time), the backend SHALL respond within 500ms without cold start delays, maintaining continuous availability through automated keep-alive pings.

**Validates: Requirements 3.8**

Property 6: Content Update Independence (Phase 6)

_For any_ lesson content update after migration to Supabase, changes SHALL be visible to users immediately without requiring frontend redeployment, and build time SHALL remain under 2 minutes regardless of content volume.

**Validates: Requirements 2.4, 2.5**

## Fix Implementation

### Phase 1: Emergency Fix - Duplicate Definition (IMMEDIATE)

**File**: `frontend/src/data/lessons.ts`

**Current State Analysis**:
According to bugfix.md, there should be two definitions, but grep only found one at line 2648:
```typescript
const allLessons = [...sampleLessonsBase, ...module3Lessons];
```

**Possible Scenarios**:
1. The duplicate was already removed but wrong line was kept (references non-existent `sampleLessons`)
2. Line numbers in bugfix.md are outdated
3. File was modified since bugfix.md was written

**Required Action**:
Verify the actual state of the file and ensure:
- Only ONE `const allLessons` definition exists
- It references `sampleLessonsBase` (not `sampleLessons`)
- It correctly combines `[...sampleLessonsBase, ...module3Lessons]`

**Specific Changes**:
1. **Verify Current State**: Check lines 2640-2670 for any duplicate or incorrect definitions
2. **Ensure Correct Definition**: The single definition should be:
   ```typescript
   const allLessons = [...sampleLessonsBase, ...module3Lessons];
   ```
3. **Verify Export**: Ensure `export const sampleLessons = allLessons;` exists after the definition
4. **Check for Undefined References**: Search entire file for any references to undefined `sampleLessons` variable before it's exported


### Phase 2: Build Optimization - Next.js Configuration

**File**: `frontend/next.config.js` (CREATE NEW)

**Purpose**: Optimize build performance for large static content files and reduce bundle size

**Specific Changes**:
1. **Enable SWC Compiler**: Use Next.js's Rust-based compiler for faster builds
2. **Configure Code Splitting**: Optimize chunk sizes for better caching
3. **Enable Tree Shaking**: Remove unused lesson data from bundles
4. **Production Optimizations**: Minification, compression, source maps

**Configuration**:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use SWC compiler (default in Next.js 14, but explicit for clarity)
  swcMinify: true,
  
  // Optimize production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimize bundle splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split large data files into separate chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Separate chunk for lesson data
          lessons: {
            test: /[\\/]src[\\/]data[\\/].*lessons.*\.ts$/,
            name: 'lessons-data',
            priority: 10,
          },
          // Separate chunk for exercise data
          exercises: {
            test: /[\\/]src[\\/]data[\\/].*exercises.*\.ts$/,
            name: 'exercises-data',
            priority: 10,
          },
        },
      };
    }
    return config;
  },
  
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ['@monaco-editor/react'],
  },
  
  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps to reduce build time
  poweredByHeader: false,
};

module.exports = nextConfig;
```

**Expected Impact**:
- Build time reduction: 5-10 minutes → 3-5 minutes
- Bundle size reduction: 10-15% smaller
- Better caching: Lesson data in separate chunk, cached independently


### Phase 3: Python Execution Timeout - Critical Safety Protection

**File**: `frontend/src/workers/pyodide.worker.ts`

**Problem**: Students can freeze their browser with infinite loops, losing all work

**Technical Challenge**: 
- Web Workers can be terminated with `Worker.terminate()`, but this kills the entire worker
- Pyodide takes 5-10 seconds to reload after termination
- Need timeout that preserves worker when possible

**Solution Architecture**:
```
Main Thread                    Worker Thread
    |                               |
    |------ execute(code) --------->|
    |                               | Start timeout timer
    |                               | Execute Python code
    |                               |
    | (30 seconds pass)             |
    |                               | Timeout fires
    |                               | Attempt graceful stop
    |<----- timeout error ----------|
    |                               |
    | terminate() if needed         |
    | create new worker             |
```

**Specific Changes**:

1. **Add Timeout Tracking in Worker**:
```typescript
// Add to worker state
let executionTimeout: NodeJS.Timeout | null = null;
const EXECUTION_TIMEOUT_MS = 30000; // 30 seconds

// Modify executeCode function
async function executeCode(code: string, timeoutMs: number = EXECUTION_TIMEOUT_MS): Promise<ExecutionResult> {
  if (!pyodide || !pyodideReady) {
    throw new Error('Pyodide not ready');
  }
  
  // Create timeout promise
  const timeoutPromise = new Promise<ExecutionResult>((_, reject) => {
    executionTimeout = setTimeout(() => {
      reject(new Error('TIMEOUT: Code execution exceeded 30 seconds. Infinite loop detected?'));
    }, timeoutMs);
  });
  
  // Race between execution and timeout
  try {
    const result = await Promise.race([
      executeCodeInternal(code),
      timeoutPromise
    ]);
    
    // Clear timeout if execution completed
    if (executionTimeout) {
      clearTimeout(executionTimeout);
      executionTimeout = null;
    }
    
    return result;
  } catch (error: any) {
    // Clear timeout on error
    if (executionTimeout) {
      clearTimeout(executionTimeout);
      executionTimeout = null;
    }
    
    // Check if it's a timeout error
    if (error.message.startsWith('TIMEOUT:')) {
      return {
        output: '',
        value: null,
        plots: [],
        error: error.message + '\n\nYour code took too long to execute. Check for infinite loops or very large computations.'
      };
    }
    
    throw error;
  }
}

// Rename current executeCode to executeCodeInternal
async function executeCodeInternal(code: string): Promise<ExecutionResult> {
  // ... existing implementation ...
}
```

2. **Add Worker Termination in Main Thread**:

**File**: `frontend/src/lib/pyodide/pyodideExecutor.ts` (or wherever worker is managed)

```typescript
class PyodideExecutor {
  private worker: Worker | null = null;
  private executionTimeout: NodeJS.Timeout | null = null;
  private readonly EXECUTION_TIMEOUT_MS = 30000;
  
  async executeCode(code: string): Promise<ExecutionResult> {
    return new Promise((resolve, reject) => {
      const id = generateId();
      
      // Set timeout for worker termination (backup safety)
      this.executionTimeout = setTimeout(() => {
        console.warn('Worker timeout - terminating and restarting');
        this.terminateWorker();
        reject(new Error('Execution timeout - worker terminated'));
      }, this.EXECUTION_TIMEOUT_MS + 1000); // 1 second grace period
      
      // Listen for result
      const handler = (event: MessageEvent) => {
        if (event.data.id === id) {
          clearTimeout(this.executionTimeout!);
          this.worker?.removeEventListener('message', handler);
          
          if (event.data.type === 'result') {
            resolve(event.data.result);
          } else if (event.data.type === 'error') {
            reject(new Error(event.data.error));
          }
        }
      };
      
      this.worker?.addEventListener('message', handler);
      this.worker?.postMessage({ type: 'execute', code, id });
    });
  }
  
  private terminateWorker(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      pyodideReady = false;
      // Will need to reinitialize on next execution
    }
  }
}
```

**Expected Impact**:
- Students protected from infinite loops
- Browser remains responsive
- Clear error message guides students to fix their code
- Worker preserved when possible (timeout in worker thread)
- Fallback termination if worker becomes unresponsive


### Phase 4: Service Worker - Pyodide Caching

**File**: `frontend/public/sw.js` (CREATE NEW)

**Problem**: Pyodide downloads 5-10 MB on every browser session (10 second load time)

**Solution**: Service Worker with Cache API for persistent storage

**Architecture**:
```
Browser Request Flow:

First Visit:
Browser → Service Worker (cache miss) → CDN → Download Pyodide → Cache → Browser
(10 seconds)

Subsequent Visits:
Browser → Service Worker (cache hit) → Return from cache → Browser
(<1 second)
```

**Specific Changes**:

1. **Create Service Worker**:

**File**: `frontend/public/sw.js`
```javascript
const CACHE_NAME = 'pyodide-cache-v0.24.1';
const PYODIDE_VERSION = '0.24.1';
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

// Files to cache
const PYODIDE_FILES = [
  'pyodide.js',
  'pyodide.asm.js',
  'pyodide.asm.wasm',
  'pyodide_py.tar',
  'packages.json',
  // Core packages
  'numpy.js',
  'numpy.data',
  'pandas.js',
  'pandas.data',
  'matplotlib.js',
  'matplotlib.data',
];

// Install event - cache Pyodide files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching Pyodide files...');
      const urlsToCache = PYODIDE_FILES.map(file => PYODIDE_CDN + file);
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('pyodide-cache-') && cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Only intercept Pyodide CDN requests
  if (url.includes('cdn.jsdelivr.net/pyodide')) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          console.log('Serving from cache:', url);
          return response;
        }
        
        console.log('Fetching from network:', url);
        return fetch(event.request).then((networkResponse) => {
          // Cache the response for future use
          if (networkResponse.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        });
      })
    );
  }
});
```

2. **Register Service Worker**:

**File**: `frontend/src/app/layout.tsx` (or `_app.tsx` if using pages router)
```typescript
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
}, []);
```

3. **Add Cache Status Indicator**:

**File**: `frontend/src/components/pyodide/PyodideLoader.tsx`
```typescript
const [cacheStatus, setCacheStatus] = useState<'checking' | 'cached' | 'downloading'>('checking');

useEffect(() => {
  // Check if Pyodide is cached
  if ('caches' in window) {
    caches.has('pyodide-cache-v0.24.1').then((hasCach) => {
      setCacheStatus(hasCache ? 'cached' : 'downloading');
    });
  }
}, []);

// Show different messages based on cache status
{cacheStatus === 'cached' && <p>Loading Python environment from cache...</p>}
{cacheStatus === 'downloading' && <p>Downloading Python environment (first time, ~10 seconds)...</p>}
```

**Expected Impact**:
- First visit: 10 seconds (unchanged)
- Subsequent visits: <1 second (90% improvement)
- Bandwidth savings: ~5-10 MB per student per session
- Better experience for 30 students loading simultaneously

**Cache Invalidation Strategy**:
- Cache name includes Pyodide version (`pyodide-cache-v0.24.1`)
- When upgrading Pyodide, change version in cache name
- Old cache automatically deleted on activation
- Manual cache clear: `caches.delete('pyodide-cache-v0.24.1')`


### Phase 5: Backend Keep-Alive - Eliminate Cold Starts

**File**: `frontend/src/lib/keepAlive.ts` (CREATE NEW)

**Problem**: Railway/Render free tier sleeps after 15 minutes, causing 30-60 second cold starts during class

**Solution**: Ping backend every 14 minutes, but ONLY during class hours (Tuesdays and Thursdays 6-8 PM Colombia time)

**Architecture**:
```
Frontend Timer (runs in browser)
    |
    | Every 14 minutes
    |
    v
Check if class time? (Tue/Thu 6-8 PM Colombia)
    |
    | Yes
    v
Ping /health endpoint
    |
    v
Backend stays awake (no cold start)
```

**Specific Changes**:

1. **Create Keep-Alive Service**:

**File**: `frontend/src/lib/keepAlive.ts`
```typescript
/**
 * Keep-Alive Service
 * Pings backend during class hours to prevent cold starts
 * Class schedule: Tuesdays and Thursdays 6:00-8:00 PM Colombia time (UTC-5)
 */

const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Class schedule in Colombia time (UTC-5)
const CLASS_DAYS = [2, 4]; // Tuesday = 2, Thursday = 4
const CLASS_START_HOUR = 18; // 6:00 PM
const CLASS_END_HOUR = 20; // 8:00 PM
const COLOMBIA_TIMEZONE = 'America/Bogota';

/**
 * Check if current time is during class hours
 */
function isClassTime(): boolean {
  try {
    // Get current time in Colombia timezone
    const now = new Date();
    const colombiaTime = new Date(now.toLocaleString('en-US', { timeZone: COLOMBIA_TIMEZONE }));
    
    const day = colombiaTime.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const hour = colombiaTime.getHours();
    
    // Check if it's Tuesday or Thursday
    const isClassDay = CLASS_DAYS.includes(day);
    
    // Check if it's between 6 PM and 8 PM
    const isClassHour = hour >= CLASS_START_HOUR && hour < CLASS_END_HOUR;
    
    return isClassDay && isClassHour;
  } catch (error) {
    console.error('Error checking class time:', error);
    return false;
  }
}

/**
 * Ping backend health endpoint
 */
async function pingBackend(): Promise<void> {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('[Keep-Alive] Backend ping successful');
    } else {
      console.warn('[Keep-Alive] Backend ping failed:', response.status);
    }
  } catch (error) {
    console.error('[Keep-Alive] Backend ping error:', error);
  }
}

/**
 * Start keep-alive service
 */
export function startKeepAlive(): () => void {
  console.log('[Keep-Alive] Service started');
  
  // Immediate check and ping if during class
  if (isClassTime()) {
    console.log('[Keep-Alive] Class time detected, pinging backend');
    pingBackend();
  }
  
  // Set up interval
  const intervalId = setInterval(() => {
    if (isClassTime()) {
      console.log('[Keep-Alive] Class time detected, pinging backend');
      pingBackend();
    } else {
      console.log('[Keep-Alive] Outside class hours, skipping ping');
    }
  }, PING_INTERVAL_MS);
  
  // Return cleanup function
  return () => {
    console.log('[Keep-Alive] Service stopped');
    clearInterval(intervalId);
  };
}
```

2. **Add Health Endpoint to Backend**:

**File**: `backend/app/api/health.py` (CREATE NEW)
```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    """
    Health check endpoint for keep-alive pings.
    Returns simple status to confirm backend is awake.
    """
    return {
        "status": "healthy",
        "message": "Backend is awake"
    }
```

**File**: `backend/app/main.py` (ADD ROUTE)
```python
from app.api import health

# Add to app initialization
app.include_router(health.router, tags=["health"])
```

3. **Initialize Keep-Alive in Frontend**:

**File**: `frontend/src/app/layout.tsx`
```typescript
import { startKeepAlive } from '@/lib/keepAlive';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Start keep-alive service
    const stopKeepAlive = startKeepAlive();
    
    // Cleanup on unmount
    return () => {
      stopKeepAlive();
    };
  }, []);
  
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```

**Expected Impact**:
- Cold start elimination during class hours (Tue/Thu 6-8 PM)
- API response time: <500ms (no 30-60 second delays)
- Minimal resource usage (only pings during 4 hours per week)
- Respects free tier limits (not 24/7 pinging)

**Ethical Considerations**:
- Only active during class hours (4 hours/week)
- Not abusing free tier (14-minute interval is reasonable)
- Provides real value to students during live instruction
- Alternative: Upgrade to paid tier ($5-7/month) for always-on backend


### Phase 6: Content Migration to Supabase - Architectural Correctness

**Problem**: 2660+ lines of educational content in TypeScript code instead of database

**Solution**: Migrate lesson content to Supabase PostgreSQL, fetch via API at runtime

**Architecture Comparison**:

**Current (Incorrect)**:
```
lessons.ts (2660 lines) → Webpack → Bundle → Deploy (5-10 min)
                                      ↓
                                  Vercel CDN
                                      ↓
                                  Browser
```

**Target (Correct)**:
```
Supabase Database ← Content Management API ← Professor Admin UI
        ↓
    Backend API
        ↓
    Frontend (runtime fetch)
        ↓
    Browser

Build time: <2 minutes (independent of content)
Content updates: Instant (no redeployment)
```

**Database Schema**:

**File**: `backend/migrations/002_lessons_content.sql` (CREATE NEW)
```sql
-- Lessons table (already exists in schema, but verify structure)
CREATE TABLE IF NOT EXISTS lessons (
    id VARCHAR(50) PRIMARY KEY,
    module_id VARCHAR(50) NOT NULL REFERENCES modules(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    duration_minutes INTEGER,
    difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lesson content table (new - stores rich content)
CREATE TABLE lesson_content (
    id SERIAL PRIMARY KEY,
    lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    content_type VARCHAR(50) NOT NULL, -- 'theory', 'example', 'exercise', 'tip'
    content_order INTEGER NOT NULL,
    title VARCHAR(200),
    markdown_content TEXT NOT NULL,
    code_example TEXT,
    code_language VARCHAR(20) DEFAULT 'python',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, content_order)
);

-- Lesson objectives table
CREATE TABLE lesson_objectives (
    id SERIAL PRIMARY KEY,
    lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    objective_text TEXT NOT NULL,
    objective_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lesson_id, objective_order)
);

-- Lesson prerequisites table
CREATE TABLE lesson_prerequisites (
    lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    prerequisite_lesson_id VARCHAR(50) NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    PRIMARY KEY (lesson_id, prerequisite_lesson_id)
);

-- Indexes for performance
CREATE INDEX idx_lessons_module_id ON lessons(module_id);
CREATE INDEX idx_lessons_order ON lessons(module_id, order_index);
CREATE INDEX idx_lesson_content_lesson_id ON lesson_content(lesson_id);
CREATE INDEX idx_lesson_content_order ON lesson_content(lesson_id, content_order);
CREATE INDEX idx_lesson_objectives_lesson_id ON lesson_objectives(lesson_id);
```

**Backend API Endpoints**:

**File**: `backend/app/api/lessons.py` (ENHANCE EXISTING)
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.lesson import Lesson, LessonContent, LessonObjective
from app.schemas.lesson import LessonResponse, LessonDetailResponse

router = APIRouter()

@router.get("/lessons", response_model=List[LessonResponse])
async def get_all_lessons(db: Session = Depends(get_db)):
    """Get all lessons with basic info"""
    lessons = db.query(Lesson).order_by(Lesson.module_id, Lesson.order_index).all()
    return lessons

@router.get("/lessons/module/{module_id}", response_model=List[LessonResponse])
async def get_lessons_by_module(module_id: str, db: Session = Depends(get_db)):
    """Get all lessons for a specific module"""
    lessons = db.query(Lesson).filter(
        Lesson.module_id == module_id
    ).order_by(Lesson.order_index).all()
    
    if not lessons:
        raise HTTPException(status_code=404, detail=f"No lessons found for module {module_id}")
    
    return lessons

@router.get("/lessons/{lesson_id}", response_model=LessonDetailResponse)
async def get_lesson_detail(lesson_id: str, db: Session = Depends(get_db)):
    """Get full lesson details including content, objectives, and prerequisites"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    
    if not lesson:
        raise HTTPException(status_code=404, detail=f"Lesson {lesson_id} not found")
    
    # Fetch related content
    content = db.query(LessonContent).filter(
        LessonContent.lesson_id == lesson_id
    ).order_by(LessonContent.content_order).all()
    
    objectives = db.query(LessonObjective).filter(
        LessonObjective.lesson_id == lesson_id
    ).order_by(LessonObjective.objective_order).all()
    
    return {
        **lesson.__dict__,
        "content": content,
        "objectives": objectives
    }
```

**Frontend API Client**:

**File**: `frontend/src/lib/api/lessons.ts` (CREATE NEW)
```typescript
import { Lesson, LessonDetail } from '@/types/lesson';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getAllLessons(): Promise<Lesson[]> {
  const response = await fetch(`${API_URL}/lessons`);
  if (!response.ok) {
    throw new Error('Failed to fetch lessons');
  }
  return response.json();
}

export async function getLessonsByModule(moduleId: string): Promise<Lesson[]> {
  const response = await fetch(`${API_URL}/lessons/module/${moduleId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch lessons for module ${moduleId}`);
  }
  return response.json();
}

export async function getLessonById(lessonId: string): Promise<LessonDetail> {
  const response = await fetch(`${API_URL}/lessons/${lessonId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch lesson ${lessonId}`);
  }
  return response.json();
}
```


**Migration Strategy**:

**Step 1: Create Migration Script**

**File**: `backend/scripts/migrate_lessons_to_db.py` (CREATE NEW)
```python
"""
Migration script to move lesson data from lessons.ts to Supabase
Reads the TypeScript file, parses lesson objects, and inserts into database
"""
import json
import re
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.lesson import Lesson, LessonContent, LessonObjective

def parse_lessons_from_ts(file_path: str) -> list:
    """
    Parse lessons from TypeScript file
    This is a simplified parser - may need adjustment based on actual structure
    """
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract lesson objects (this is simplified - actual implementation may vary)
    # Pattern to match lesson objects
    lesson_pattern = r'\{[^}]*id:\s*["\']([^"\']+)["\'][^}]*\}'
    
    # TODO: Implement proper TypeScript parsing
    # For now, manually convert lessons.ts to JSON format
    # Or use a TypeScript parser library
    
    return []

def migrate_lessons(db: Session, lessons_data: list):
    """Insert lessons into database"""
    for lesson_data in lessons_data:
        # Create lesson record
        lesson = Lesson(
            id=lesson_data['id'],
            module_id=lesson_data['moduleId'],
            title=lesson_data['title'],
            description=lesson_data.get('description'),
            order_index=lesson_data['orderIndex'],
            duration_minutes=lesson_data.get('duration', 30),
            difficulty=lesson_data.get('difficulty', 'beginner')
        )
        db.add(lesson)
        
        # Create content records
        if 'content' in lesson_data:
            for idx, content_item in enumerate(lesson_data['content']):
                content = LessonContent(
                    lesson_id=lesson_data['id'],
                    content_type=content_item.get('type', 'theory'),
                    content_order=idx,
                    title=content_item.get('title'),
                    markdown_content=content_item.get('content', ''),
                    code_example=content_item.get('code'),
                    code_language=content_item.get('language', 'python')
                )
                db.add(content)
        
        # Create objectives
        if 'objectives' in lesson_data:
            for idx, objective_text in enumerate(lesson_data['objectives']):
                objective = LessonObjective(
                    lesson_id=lesson_data['id'],
                    objective_text=objective_text,
                    objective_order=idx
                )
                db.add(objective)
    
    db.commit()
    print(f"Migrated {len(lessons_data)} lessons to database")

if __name__ == "__main__":
    # Manual migration process:
    # 1. Convert lessons.ts to JSON format (manually or with tool)
    # 2. Load JSON data
    # 3. Run migration
    
    db = SessionLocal()
    try:
        # Load lessons data (from JSON file after manual conversion)
        with open('lessons_data.json', 'r', encoding='utf-8') as f:
            lessons_data = json.load(f)
        
        migrate_lessons(db, lessons_data)
    finally:
        db.close()
```

**Step 2: Gradual Migration Plan**

1. **Phase 6a: Dual Mode (Transition Period)**
   - Keep `lessons.ts` as fallback
   - Add API fetching with fallback to static data
   - Test with subset of lessons in database
   - Verify performance and correctness

2. **Phase 6b: Database Primary**
   - All lessons in database
   - Frontend fetches from API by default
   - Keep `lessons.ts` for development/testing only
   - Monitor for issues

3. **Phase 6c: Remove Static Data**
   - Delete `lessons.ts` (or keep minimal sample data)
   - Frontend exclusively uses API
   - Build time reduced to <2 minutes
   - Content updates via admin interface

**Frontend Component Updates**:

**File**: `frontend/src/app/student/laboratory/[lessonId]/page.tsx` (MODIFY)
```typescript
// Before: Static import
// import { getLessonById } from '@/data/lessons';

// After: API fetch
import { getLessonById } from '@/lib/api/lessons';

export default async function LessonPage({ params }: { params: { lessonId: string } }) {
  // This now fetches from API instead of static data
  const lesson = await getLessonById(params.lessonId);
  
  if (!lesson) {
    notFound();
  }
  
  return <LessonView lesson={lesson} />;
}
```

**Caching Strategy**:
```typescript
// Use Next.js caching for API responses
export const revalidate = 3600; // Revalidate every hour

// Or use React Query for client-side caching
const { data: lesson, isLoading } = useQuery({
  queryKey: ['lesson', lessonId],
  queryFn: () => getLessonById(lessonId),
  staleTime: 1000 * 60 * 60, // 1 hour
});
```

**Expected Impact**:
- Build time: 5-10 minutes → <2 minutes (60-80% reduction)
- Content updates: 5-10 minute deploy → Instant (100% improvement)
- Professor autonomy: Can edit lessons without developer
- Scalability: Build time independent of content volume
- Maintainability: Content separated from code


## Testing Strategy

### Validation Approach

The testing strategy follows a multi-phase approach aligned with the fix phases:
1. **Phase 1**: Verify build compilation success and lesson data integrity
2. **Phase 2**: Measure build performance improvements
3. **Phase 3**: Test timeout protection with infinite loops
4. **Phase 4**: Verify Service Worker caching behavior
5. **Phase 5**: Confirm backend availability during class hours
6. **Phase 6**: Validate data migration and API correctness

### Exploratory Fault Condition Checking

**Goal**: Surface counterexamples that demonstrate the bugs BEFORE implementing fixes. Confirm or refute the root cause analysis.

**Phase 1 - Build Compilation**:
1. **Duplicate Definition Test**: Attempt to build with duplicate `allLessons` (will fail on unfixed code)
2. **Undefined Reference Test**: Check for references to undefined `sampleLessons` (will fail on unfixed code)
3. **Build Success Test**: Verify build completes after fix (will pass on fixed code)

**Phase 3 - Python Timeout**:
1. **Infinite Loop Test**: Execute `while True: pass` (will freeze on unfixed code)
2. **Long Computation Test**: Execute code that takes 35 seconds (will freeze on unfixed code)
3. **Timeout Message Test**: Verify clear error message after timeout (will fail on unfixed code)

**Phase 4 - Pyodide Caching**:
1. **First Load Test**: Measure Pyodide load time on first visit (will be ~10s on unfixed code)
2. **Cached Load Test**: Measure load time on second visit (will be ~10s on unfixed code without Service Worker)
3. **Cache Persistence Test**: Close browser, reopen, measure load time (will be ~10s on unfixed code)

**Phase 5 - Backend Cold Start**:
1. **Sleep Test**: Wait 20 minutes, make API request (will take 30-60s on unfixed code)
2. **Class Time Test**: Make API request during class hours (will take 30-60s if backend was asleep)
3. **Keep-Alive Test**: Verify pings occur every 14 minutes during class (will not happen on unfixed code)

**Phase 6 - Content Migration**:
1. **Data Integrity Test**: Compare lesson data from API vs static file (will differ if migration has errors)
2. **Performance Test**: Measure page load time with API fetch (may be slower on unfixed code)
3. **Build Time Test**: Measure build time with content in database (will be 5-10 min on unfixed code)

**Expected Counterexamples**:
- Build fails with "duplicate definition" error
- Browser freezes on infinite loop
- Pyodide redownloads on every visit
- API requests take 30-60 seconds after inactivity
- Build time increases with content volume

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Phase 1 - Build Compilation**:
```
FOR ALL TypeScript files in frontend/src/data/ DO
  result := nextBuild()
  ASSERT result.success === true
  ASSERT result.errors.length === 0
  ASSERT result.buildTime < 180000 // 3 minutes
END FOR
```

**Phase 3 - Python Timeout**:
```
FOR ALL Python code WHERE executionTime > 30 seconds DO
  result := executePython(code)
  ASSERT result.error !== null
  ASSERT result.error.includes('TIMEOUT')
  ASSERT result.executionTime <= 31000 // 30s + 1s grace
END FOR
```

**Phase 4 - Pyodide Caching**:
```
FOR ALL Pyodide CDN requests WHERE visitCount > 1 DO
  result := fetchPyodide()
  ASSERT result.source === 'cache'
  ASSERT result.loadTime < 1000 // <1 second
END FOR
```

**Phase 5 - Backend Keep-Alive**:
```
FOR ALL time periods WHERE isClassTime() === true DO
  result := checkBackendStatus()
  ASSERT result.responseTime < 500 // <500ms
  ASSERT result.coldStart === false
END FOR
```

**Phase 6 - Content Migration**:
```
FOR ALL lessons in database DO
  apiLesson := getLessonById(lesson.id)
  staticLesson := staticLessons.find(l => l.id === lesson.id)
  ASSERT apiLesson.id === staticLesson.id
  ASSERT apiLesson.title === staticLesson.title
  ASSERT apiLesson.content.length === staticLesson.content.length
END FOR
```


### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**
```
FOR ALL lesson access patterns WHERE NOT isBuildError() DO
  ASSERT getLessonById_fixed(id) === getLessonById_original(id)
  ASSERT getLessonsByModule_fixed(moduleId) === getLessonsByModule_original(moduleId)
  ASSERT sampleLessons_fixed === sampleLessons_original
END FOR
```

**Testing Approach**: Property-based testing is recommended for preservation checking because:
- It generates many test cases automatically across the input domain
- It catches edge cases that manual unit tests might miss
- It provides strong guarantees that behavior is unchanged for all non-buggy inputs

**Test Plan**: Observe behavior on UNFIXED code first for lesson data access, then write property-based tests capturing that behavior.

**Test Cases**:

1. **Lesson Data Preservation**: Verify all lesson objects remain identical after fix
   - Observe: Current lesson data structure and content
   - Test: Compare lesson objects before and after fix
   - Assert: All fields match (id, title, content, objectives, etc.)

2. **Function Behavior Preservation**: Verify helper functions work identically
   - Observe: `getLessonById()` returns correct lesson for valid IDs
   - Test: Call function with all lesson IDs
   - Assert: Returns same lesson objects as before

3. **Export Preservation**: Verify `sampleLessons` export remains accessible
   - Observe: Components can import and use `sampleLessons`
   - Test: Import in test file and verify structure
   - Assert: Array length and content match original

4. **Development Mode Preservation**: Verify hot reloading continues working
   - Observe: Changes to lesson data trigger hot reload in dev mode
   - Test: Modify lesson data and check for reload
   - Assert: Changes appear without full page refresh

5. **Python Execution Preservation**: Verify valid code continues to execute correctly
   - Observe: Python code that completes in <30 seconds works correctly
   - Test: Execute various valid Python programs
   - Assert: Results match expected output, no timeout errors

6. **Pyodide Package Preservation**: Verify numpy, pandas, matplotlib still work
   - Observe: Students can use scientific libraries
   - Test: Execute code using each library
   - Assert: Libraries load and function correctly

7. **Backend API Preservation**: Verify non-lesson endpoints continue working
   - Observe: Auth, submissions, grades APIs work correctly
   - Test: Call each endpoint with valid data
   - Assert: Responses match expected format and data

### Unit Tests

**Phase 1 - Build Compilation**:
- Test that `allLessons` is defined exactly once
- Test that `sampleLessonsBase` is referenced correctly
- Test that `module3Lessons` is imported and combined
- Test that exports are accessible

**Phase 2 - Build Optimization**:
- Test that `next.config.js` is valid JavaScript
- Test that webpack configuration doesn't break builds
- Test that code splitting produces expected chunks
- Test that bundle size is reduced

**Phase 3 - Python Timeout**:
- Test timeout with `while True: pass`
- Test timeout with `time.sleep(35)`
- Test that valid code completes without timeout
- Test that timeout error message is clear
- Test that worker can execute code after timeout

**Phase 4 - Service Worker**:
- Test Service Worker registration succeeds
- Test cache is created on first load
- Test cache is used on subsequent loads
- Test old caches are deleted on version change
- Test fallback to network if cache fails

**Phase 5 - Backend Keep-Alive**:
- Test `isClassTime()` returns true during class hours
- Test `isClassTime()` returns false outside class hours
- Test ping occurs every 14 minutes during class
- Test ping does not occur outside class hours
- Test health endpoint returns 200 OK

**Phase 6 - Content Migration**:
- Test lesson data is correctly inserted into database
- Test API returns correct lesson by ID
- Test API returns correct lessons by module
- Test lesson content is properly structured
- Test objectives and prerequisites are linked correctly

### Property-Based Tests

**Phase 1 - Build Compilation**:
- Generate random lesson data structures and verify they compile
- Generate random module combinations and verify build succeeds
- Test that any valid lesson ID can be retrieved

**Phase 3 - Python Timeout**:
- Generate random Python code and verify timeout protection
- Generate random execution times and verify correct timeout behavior
- Test that any valid Python code completes or times out gracefully

**Phase 4 - Service Worker**:
- Generate random Pyodide file requests and verify caching
- Generate random cache scenarios and verify correct behavior
- Test that any Pyodide file can be cached and retrieved

**Phase 6 - Content Migration**:
- Generate random lesson queries and verify API correctness
- Generate random module IDs and verify lesson filtering
- Test that any lesson in database can be retrieved via API

### Integration Tests

**Phase 1 - Build Compilation**:
- Full build test: `npm run build` completes successfully
- Deployment test: Vercel deployment succeeds
- Runtime test: Application loads and displays lessons correctly

**Phase 3 - Python Timeout**:
- Full execution flow: Student writes code → executes → timeout triggers → error displayed
- Worker recovery: Timeout occurs → worker restarts → next execution succeeds
- UI responsiveness: Timeout occurs → UI remains responsive → student can continue working

**Phase 4 - Service Worker**:
- Full caching flow: First visit → download → cache → second visit → load from cache
- Version update: New Pyodide version → old cache deleted → new cache created
- Offline behavior: Network unavailable → Pyodide loads from cache

**Phase 5 - Backend Keep-Alive**:
- Full class session: Class starts → pings begin → backend stays awake → class ends → pings stop
- Cold start prevention: Backend idle 14 minutes → ping occurs → next API request fast
- Timezone handling: Test from different timezones → correct class time detection

**Phase 6 - Content Migration**:
- Full lesson flow: Student navigates to lesson → API fetch → content displayed → exercises work
- Content update flow: Professor edits lesson → changes saved to database → students see updates immediately
- Build independence: Content updated → frontend build time unchanged

### Performance Benchmarks

**Phase 1 - Build Time**:
- Baseline: Current build time (5-10 minutes)
- Target: <3 minutes after fix
- Measurement: `time npm run build`

**Phase 2 - Build Optimization**:
- Baseline: 3 minutes (after Phase 1)
- Target: <2 minutes with optimizations
- Measurement: `time npm run build` with next.config.js

**Phase 3 - Timeout Response**:
- Baseline: Infinite (browser freeze)
- Target: 30 seconds maximum
- Measurement: Time from execution start to timeout error

**Phase 4 - Pyodide Load Time**:
- Baseline: 10 seconds every visit
- Target: <1 second on subsequent visits
- Measurement: Time from page load to Pyodide ready

**Phase 5 - API Response Time**:
- Baseline: 30-60 seconds (cold start)
- Target: <500ms during class hours
- Measurement: Time from request to response

**Phase 6 - Content Update Time**:
- Baseline: 5-10 minutes (full redeployment)
- Target: <1 second (database update)
- Measurement: Time from save to visible in frontend

## Implementation Phases and Dependencies

### Phase Dependencies

```
Phase 1 (Emergency Fix)
    ↓
Phase 2 (Build Optimization) ← Independent
    ↓
Phase 3 (Timeout Protection) ← Independent
    ↓
Phase 4 (Service Worker) ← Independent
    ↓
Phase 5 (Keep-Alive) ← Independent
    ↓
Phase 6 (Content Migration) ← Depends on backend API being functional
```

### Recommended Implementation Order

1. **Phase 1 (IMMEDIATE)**: Fix duplicate definition - unblocks deployment
2. **Phase 3 (HIGH PRIORITY)**: Python timeout - protects students from losing work
3. **Phase 2 (MEDIUM PRIORITY)**: Build optimization - improves developer experience
4. **Phase 4 (MEDIUM PRIORITY)**: Service Worker - significantly improves student experience
5. **Phase 5 (MEDIUM PRIORITY)**: Keep-alive - eliminates class disruptions
6. **Phase 6 (LONG TERM)**: Content migration - architectural correctness, enables professor autonomy

### Rollback Strategy

Each phase should be independently deployable and reversible:

- **Phase 1**: Revert file changes if build fails
- **Phase 2**: Remove `next.config.js` if build breaks
- **Phase 3**: Remove timeout logic if it causes issues, worker continues working
- **Phase 4**: Unregister Service Worker if caching causes problems
- **Phase 5**: Stop keep-alive service if it causes backend issues
- **Phase 6**: Keep static data as fallback during migration, switch back if API fails

### Success Criteria

**Phase 1**: ✅ Vercel build completes successfully, application deploys
**Phase 2**: ✅ Build time <3 minutes, bundle size reduced by 10%
**Phase 3**: ✅ Infinite loops terminate after 30 seconds, clear error message
**Phase 4**: ✅ Pyodide loads in <1 second on subsequent visits
**Phase 5**: ✅ API response <500ms during class hours, no cold starts
**Phase 6**: ✅ Content updates instant, build time <2 minutes, professors can edit lessons

