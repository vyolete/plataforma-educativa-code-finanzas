# Bugfix Requirements Document

## Introduction

The Next.js application fails to compile during Vercel deployment due to a duplicate constant definition in `frontend/src/data/lessons.ts`. The variable `allLessons` is defined twice (lines 2648 and 2660), causing a webpack compilation error that prevents the build from completing. This blocks all deployments to Vercel and makes the application undeployable.

The error occurs because there are two conflicting definitions:
- Line 2648: `const allLessons = [...sampleLessons, ...module3Lessons];` (references undefined `sampleLessons`)
- Line 2660: `const allLessons = [...sampleLessonsBase, ...module3Lessons];` (correct definition using `sampleLessonsBase`)

## Root Cause Analysis

While the immediate blocker is the duplicate `allLessons` definition, this bug is a **symptom of a deeper architectural problem**: educational content (2660+ lines) is stored in TypeScript code instead of a database.

**Why this architecture is problematic:**
- Webpack must process thousands of lines of static content on every build
- Content changes require full redeployment (commit → push → 5-10 minute Vercel build)
- Professors cannot edit lessons without developer intervention
- Build times increase linearly with content growth
- Merge conflicts are frequent when multiple people edit lessons

**The correct architecture:**
- Educational content should live in Supabase (PostgreSQL)
- Frontend should fetch lessons via API at runtime
- Content updates should be instant (no redeployment needed)
- Build time should be independent of content volume

This bugfix addresses the immediate deployment blocker, but the platform requires architectural migration to be maintainable long-term.

## Related Critical Issues

While fixing the duplicate definition unblocks deployment, there are 4 additional high-priority architectural blockers that impact production readiness:

### 1. Migrate lessons.ts to Supabase (BLOQUEANTE PRINCIPAL)
**Current State:** 2660+ lines of educational content in TypeScript code  
**Impact:** 
- Slow builds (webpack processes all content)
- Content updates require 5-10 minute redeployment cycle
- Professors cannot edit content independently
- Not scalable for course evolution

**Required Solution:** Migrate lesson content to Supabase tables, fetch via API at runtime

### 2. Service Worker for Pyodide Caching
**Current State:** Pyodide (5-10 MB) downloads completely on every browser session  
**Impact:**
- 10-second load time on EVERY visit
- 30 students loading simultaneously during class creates poor experience
- Wastes bandwidth and time

**Required Solution:** Service Worker with persistent cache, <1 second load on subsequent visits

### 3. Backend Keep-Alive System
**Current State:** Railway/Render free tier sleeps backend after 15 minutes of inactivity  
**Impact:**
- 30-60 second cold starts during class
- First student request takes 1 minute to respond
- Disrupts class flow (Tuesdays/Thursdays 6-8 PM)

**Required Solution:** Ping backend every 14 minutes from frontend during class hours

### 4. Python Execution Timeout
**Current State:** No time limit on Pyodide code execution  
**Impact:**
- `while True:` loops freeze student's browser
- Student loses all work, must close tab/restart browser
- Directly affects students during class exercises

**Required Solution:** 30-second timeout with terminable Web Worker

**Priority Order:**
1. **URGENTE:** Fix duplicate allLessons (blocks current deploy)
2. **ALTA:** Python execution timeout (protects students)
3. **ALTA:** Migrate to Supabase (solves build performance + enables content editing)
4. **MEDIA:** Service Worker for Pyodide (significantly improves UX)
5. **MEDIA:** Backend keep-alive (eliminates cold starts during class)

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the Next.js build process compiles `frontend/src/data/lessons.ts` THEN the system fails with error "the name `allLessons` is defined multiple times"

1.2 WHEN Vercel attempts to deploy the application THEN the build process exits with code 1 and deployment fails

1.3 WHEN the first `allLessons` definition is evaluated THEN it references `sampleLessons` which does not exist at that point in the code

### Expected Behavior (Correct)

2.1 WHEN the Next.js build process compiles `frontend/src/data/lessons.ts` THEN the system SHALL successfully compile without duplicate definition errors

2.2 WHEN Vercel attempts to deploy the application THEN the build process SHALL complete successfully and deploy the application

2.3 WHEN `allLessons` is defined THEN it SHALL combine `sampleLessonsBase` and `module3Lessons` arrays exactly once

2.4 WHEN the build completes THEN the total build time SHALL be under 3 minutes (current: 5-10 minutes with content in code)

2.5 WHEN lesson content is updated THEN changes SHALL be deployable without requiring full application rebuild (future state: content in Supabase)

### Performance Targets (Post-Architectural Fixes)

**Build Performance:**
- Build time: <2 minutes (independent of content volume)
- Deploy frequency: Multiple times per day without performance degradation

**Runtime Performance:**
- Pyodide initial load: <10 seconds (first visit), <1 second (subsequent visits with Service Worker)
- Backend API response: <500ms (with keep-alive, no cold starts during class hours)
- Python code execution: <5 seconds typical, 30 seconds maximum (with timeout protection)

**Content Management:**
- Lesson updates: Instant (no redeployment)
- Content editing: Available to professors via admin interface
- Build independence: Frontend build time unaffected by content volume

### Unchanged Behavior (Regression Prevention)

3.1 WHEN `getLessonById()` is called with a valid lesson ID THEN the system SHALL CONTINUE TO return the correct lesson object

3.2 WHEN `getLessonsByModule()` is called with a valid module ID THEN the system SHALL CONTINUE TO return all lessons for that module sorted by orderIndex

3.3 WHEN `sampleLessons` is exported and imported by other components THEN the system SHALL CONTINUE TO provide access to all lessons including Module 3 lessons

3.4 WHEN the application runs in development mode with `npm run dev` THEN the system SHALL CONTINUE TO function correctly with hot module reloading

3.5 WHEN students execute valid Python code in the laboratory THEN the system SHALL CONTINUE TO return correct results without regression

3.6 WHEN professors access the admin dashboard THEN the system SHALL CONTINUE TO display student progress and grades correctly

3.7 WHEN team submissions are uploaded THEN the system SHALL CONTINUE TO store and validate notebooks correctly

3.8 WHEN students access lessons during class hours (6-8 PM Tue/Thu) THEN the system SHALL CONTINUE TO load content without backend cold start delays
