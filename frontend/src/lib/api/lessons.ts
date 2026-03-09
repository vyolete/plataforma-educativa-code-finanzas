/**
 * API client for lesson-related endpoints
 * Provides functions to fetch lesson data from the backend API
 */

import { apiClient } from './client';
import type { Lesson, LessonDetail, LessonCreate, LessonUpdate } from '@/types/lesson';

/**
 * Get all lessons with basic information
 * Returns lessons ordered by module_id and order_index
 * 
 * @returns Promise<Lesson[]> Array of all lessons
 * @throws Error if the API request fails
 */
export async function getAllLessons(): Promise<Lesson[]> {
  try {
    return await apiClient.get<Lesson[]>('/api/lessons');
  } catch (error) {
    console.error('Error fetching all lessons:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to fetch lessons'
    );
  }
}

/**
 * Get all lessons for a specific module
 * Returns lessons ordered by order_index
 * 
 * @param moduleId - ID of the module to fetch lessons for
 * @returns Promise<Lesson[]> Array of lessons for the module
 * @throws Error if the API request fails or no lessons found
 */
export async function getLessonsByModule(moduleId: number): Promise<Lesson[]> {
  try {
    return await apiClient.get<Lesson[]>(`/api/lessons/module/${moduleId}`);
  } catch (error) {
    console.error(`Error fetching lessons for module ${moduleId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : `Failed to fetch lessons for module ${moduleId}`
    );
  }
}

/**
 * Get full lesson details including content blocks, objectives, and prerequisites
 * 
 * @param lessonId - ID of the lesson to fetch
 * @returns Promise<LessonDetail> Detailed lesson information
 * @throws Error if the API request fails or lesson not found
 */
export async function getLessonById(lessonId: number): Promise<LessonDetail> {
  try {
    return await apiClient.get<LessonDetail>(`/api/lessons/${lessonId}`);
  } catch (error) {
    console.error(`Error fetching lesson ${lessonId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : `Failed to fetch lesson ${lessonId}`
    );
  }
}

/**
 * Create a new lesson (admin only)
 * 
 * @param lessonData - Data for the new lesson
 * @returns Promise<Lesson> Created lesson
 * @throws Error if the API request fails or validation fails
 */
export async function createLesson(lessonData: LessonCreate): Promise<Lesson> {
  try {
    return await apiClient.post<Lesson>('/api/lessons', lessonData);
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to create lesson'
    );
  }
}

/**
 * Update an existing lesson (admin only)
 * 
 * @param lessonId - ID of the lesson to update
 * @param lessonData - Fields to update
 * @returns Promise<Lesson> Updated lesson
 * @throws Error if the API request fails or lesson not found
 */
export async function updateLesson(
  lessonId: number, 
  lessonData: LessonUpdate
): Promise<Lesson> {
  try {
    return await apiClient.put<Lesson>(`/api/lessons/${lessonId}`, lessonData);
  } catch (error) {
    console.error(`Error updating lesson ${lessonId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : `Failed to update lesson ${lessonId}`
    );
  }
}

/**
 * Delete a lesson (admin only)
 * 
 * @param lessonId - ID of the lesson to delete
 * @returns Promise<void>
 * @throws Error if the API request fails or lesson not found
 */
export async function deleteLesson(lessonId: number): Promise<void> {
  try {
    await apiClient.delete<void>(`/api/lessons/${lessonId}`);
  } catch (error) {
    console.error(`Error deleting lesson ${lessonId}:`, error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : `Failed to delete lesson ${lessonId}`
    );
  }
}
