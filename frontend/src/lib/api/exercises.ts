/**
 * API client for exercise-related endpoints
 * Provides functions to fetch exercise data from the backend API
 */

import { apiClient } from './client';

export interface Exercise {
  id: string;
  moduleId: string;
  lessonId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  starterCode: string;
  solution: string;
  hints: string[];
  testCases: {
    input?: string;
    expectedOutput: string;
    description: string;
  }[];
  tags: string[];
}

/**
 * Get all exercises for a specific module
 * Returns exercises ordered by lesson and difficulty
 * 
 * @param moduleId - ID of the module to fetch exercises for
 * @returns Promise<Exercise[]> Array of exercises for the module
 * @throws Error if the API request fails or no exercises found
 */
export async function getExercisesByModule(moduleId: string): Promise<Exercise[]> {
  try {
    return await apiClient.get<Exercise[]>(`/api/exercises/module/${moduleId}`);
  } catch (error) {
    console.error(`Error fetching exercises for module ${moduleId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : `Failed to fetch exercises for module ${moduleId}`
    );
  }
}

/**
 * Get a specific exercise by ID
 * 
 * @param exerciseId - ID of the exercise to fetch
 * @returns Promise<Exercise> Exercise details
 * @throws Error if the API request fails or exercise not found
 */
export async function getExerciseById(exerciseId: string): Promise<Exercise> {
  try {
    return await apiClient.get<Exercise>(`/api/exercises/${exerciseId}`);
  } catch (error) {
    console.error(`Error fetching exercise ${exerciseId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : `Failed to fetch exercise ${exerciseId}`
    );
  }
}

/**
 * Get all exercises for a specific lesson
 * 
 * @param lessonId - ID of the lesson to fetch exercises for
 * @returns Promise<Exercise[]> Array of exercises for the lesson
 * @throws Error if the API request fails
 */
export async function getExercisesByLesson(lessonId: string): Promise<Exercise[]> {
  try {
    return await apiClient.get<Exercise[]>(`/api/exercises/lesson/${lessonId}`);
  } catch (error) {
    console.error(`Error fetching exercises for lesson ${lessonId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : `Failed to fetch exercises for lesson ${lessonId}`
    );
  }
}

/**
 * Submit an exercise solution
 * 
 * @param exerciseId - ID of the exercise
 * @param code - Student's code solution
 * @returns Promise<any> Submission result
 * @throws Error if the API request fails
 */
export async function submitExercise(exerciseId: string, code: string): Promise<any> {
  try {
    return await apiClient.post<any>(`/api/exercises/${exerciseId}/submit`, { code });
  } catch (error) {
    console.error(`Error submitting exercise ${exerciseId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : `Failed to submit exercise ${exerciseId}`
    );
  }
}

/**
 * Update submission result
 * 
 * @param submissionId - ID of the submission
 * @param result - Result data
 * @returns Promise<any> Updated submission
 * @throws Error if the API request fails
 */
export async function updateSubmissionResult(submissionId: string, result: any): Promise<any> {
  try {
    return await apiClient.put<any>(`/api/exercises/submissions/${submissionId}`, result);
  } catch (error) {
    console.error(`Error updating submission ${submissionId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : `Failed to update submission ${submissionId}`
    );
  }
}

/**
 * Track hint usage for an exercise
 * 
 * @param exerciseId - ID of the exercise
 * @param hintIndex - Index of the hint used
 * @returns Promise<void>
 * @throws Error if the API request fails
 */
export async function trackHintUsage(exerciseId: string, hintIndex: number): Promise<void> {
  try {
    await apiClient.post<void>(`/api/exercises/${exerciseId}/hints/${hintIndex}`);
  } catch (error) {
    console.error(`Error tracking hint usage for exercise ${exerciseId}:`, error);
    // Don't throw - hint tracking is not critical
  }
}
