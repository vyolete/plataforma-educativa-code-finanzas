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
