/**
 * API client for exercise-related endpoints
 */

import { apiClient } from './client';

export interface TestCase {
  input: string;
  expectedOutput: string;
  description: string;
}

export interface Exercise {
  id: number;
  moduleId: number;
  lessonId?: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  starterCode?: string;
  testCases: TestCase[];
  hints?: string[];
  points: number;
  createdAt: string;
}

export interface ExerciseSubmission {
  id: number;
  exerciseId: number;
  userId: number;
  code: string;
  status: 'correct' | 'incorrect' | 'pending';
  output?: string;
  submittedAt: string;
  executionTimeMs?: number;
}

export interface SubmitExerciseData {
  code: string;
}

export interface UpdateSubmissionData {
  status: 'correct' | 'incorrect' | 'pending';
  output?: string;
  executionTimeMs?: number;
}

/**
 * Get all exercises for a module
 */
export async function getExercisesByModule(moduleId: number): Promise<Exercise[]> {
  const response = await apiClient.get(`/exercises/module/${moduleId}`);
  return response.data;
}

/**
 * Get a specific exercise by ID
 */
export async function getExercise(exerciseId: number): Promise<Exercise> {
  const response = await apiClient.get(`/exercises/${exerciseId}`);
  return response.data;
}

/**
 * Submit an exercise solution
 */
export async function submitExercise(
  exerciseId: number,
  data: SubmitExerciseData
): Promise<ExerciseSubmission> {
  const response = await apiClient.post(`/exercises/${exerciseId}/submit`, data);
  return response.data;
}

/**
 * Update submission result after validation
 */
export async function updateSubmissionResult(
  exerciseId: number,
  submissionId: number,
  data: UpdateSubmissionData
): Promise<ExerciseSubmission> {
  const response = await apiClient.put(
    `/exercises/${exerciseId}/submit/${submissionId}`,
    null,
    {
      params: {
        status: data.status,
        output: data.output,
        execution_time_ms: data.executionTimeMs
      }
    }
  );
  return response.data;
}

/**
 * Get hints for an exercise
 */
export async function getExerciseHints(
  exerciseId: number,
  hintLevel: number = 1
): Promise<{
  exerciseId: number;
  hintLevel: number;
  hints: string[];
  totalHints: number;
}> {
  const response = await apiClient.get(`/exercises/${exerciseId}/hints`, {
    params: { hint_level: hintLevel }
  });
  return response.data;
}

/**
 * Get user's submissions for an exercise
 */
export async function getUserSubmissions(
  exerciseId: number
): Promise<ExerciseSubmission[]> {
  const response = await apiClient.get(`/exercises/${exerciseId}/submissions`);
  return response.data;
}

/**
 * Track hint usage for an exercise
 */
export async function trackHintUsage(exerciseId: number, hintLevel: number): Promise<void> {
  try {
    await apiClient.post(`/exercises/${exerciseId}/hints/track`, {
      exercise_id: exerciseId,
      hint_level: hintLevel
    });
  } catch (error) {
    console.error('Error tracking hint usage:', error);
    // Don't throw - hint tracking is not critical
  }
}
