# Bugfix Requirements Document

## Introduction

The Módulo 1 frontend components are using static TypeScript imports for lesson and exercise data instead of fetching from the Supabase API. This causes Vercel builds to process ~2660 lines of static content, resulting in slow builds, frequent failures, and deployment issues. The backend API and database migration are already complete, but the frontend has not been updated to consume the API.

This bugfix will update the frontend components to use the existing Supabase API, eliminating static data imports and enabling successful Vercel deployments.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN ContentPanel.tsx renders THEN the system imports lesson data from static TypeScript file `@/data/lessons` instead of fetching from API

1.2 WHEN ExercisesPanel.tsx renders THEN the system imports exercise data from static TypeScript file `@/data/exercises` instead of fetching from API

1.3 WHEN Vercel builds the frontend THEN the system processes ~2660 lines of static content causing slow builds (>3 minutes) and frequent failures

1.4 WHEN the build completes THEN the system deploys with stale static data instead of dynamic Supabase data

1.5 WHEN Pyodide worker executes code THEN the system has no timeout mechanism allowing infinite execution

1.6 WHEN Next.js builds the application THEN the system lacks build optimizations in next.config.js

### Expected Behavior (Correct)

2.1 WHEN ContentPanel.tsx renders THEN the system SHALL fetch lesson data using `getLessonById()` and `getLessonsByModule()` from the API client

2.2 WHEN ExercisesPanel.tsx renders THEN the system SHALL fetch exercise data from the API (if exercises API exists) or maintain static imports temporarily

2.3 WHEN Vercel builds the frontend THEN the system SHALL complete builds in <3 minutes without processing large static content

2.4 WHEN the build completes THEN the system SHALL deploy successfully to Vercel with dynamic API data loading

2.5 WHEN Pyodide worker executes code THEN the system SHALL enforce a 30-second timeout to prevent infinite execution

2.6 WHEN Next.js builds the application THEN the system SHALL use optimized configuration from next.config.js

### Unchanged Behavior (Regression Prevention)

3.1 WHEN ContentPanel displays lesson content THEN the system SHALL CONTINUE TO render markdown with syntax highlighting and custom styling

3.2 WHEN ContentPanel navigates between lessons THEN the system SHALL CONTINUE TO provide Previous/Next buttons with proper state management

3.3 WHEN ExercisesPanel displays exercises THEN the system SHALL CONTINUE TO show completion status, difficulty badges, and progress tracking

3.4 WHEN ExercisesPanel selects an exercise THEN the system SHALL CONTINUE TO integrate with ExerciseContext and show ExerciseView

3.5 WHEN users interact with the laboratory interface THEN the system SHALL CONTINUE TO provide the same 4-panel layout and functionality

3.6 WHEN lesson or exercise data is unavailable THEN the system SHALL CONTINUE TO display appropriate error messages

3.7 WHEN the application runs in development mode THEN the system SHALL CONTINUE TO function with hot reload and debugging capabilities
