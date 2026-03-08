/**
 * API client for progress tracking endpoints
 */

import { apiClient } from './client';

export interface ModuleProgress {
  module_id: number;
  module_name: string;
  exercises_completed: number;
  exercises_total: number;
  last_activity: string | null;
}

export interface CodeActivity {
  id: number;
  user_id: number;
  code_snippet: string;
  execution_count: number;
  last_executed: string;
}

export interface OverallProgress {
  total_exercises_completed: number;
  total_exercises: number;
  modules_progress: ModuleProgress[];
  recent_activity: CodeActivity[];
  total_code_executions: number;
}

/**
 * Get current user's overall progress across all modules
 */
export async function getMyProgress(): Promise<OverallProgress> {
  return apiClient.get<OverallProgress>('/progress/me');
}

/**
 * Get progress for a specific module
 */
export async function getModuleProgress(moduleId: number): Promise<ModuleProgress> {
  return apiClient.get<ModuleProgress>(`/progress/module/${moduleId}`);
}

/**
 * Register a code execution activity
 */
export async function registerCodeActivity(codeSnippet: string, executionCount: number = 1): Promise<CodeActivity> {
  return apiClient.post<CodeActivity>('/progress/activity', {
    code_snippet: codeSnippet,
    execution_count: executionCount
  });
}
