/**
 * Tests for lessons API client
 */

import { 
  getAllLessons, 
  getLessonsByModule, 
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson
} from '../lessons';
import { apiClient } from '../client';
import type { Lesson, LessonDetail, LessonCreate, LessonUpdate } from '@/types/lesson';

// Mock the API client
jest.mock('../client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

describe('Lessons API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllLessons', () => {
    it('should fetch all lessons successfully', async () => {
      const mockLessons: Lesson[] = [
        {
          id: 1,
          module_id: 1,
          title: 'Introducción a Python',
          content: 'Python es un lenguaje...',
          code_template: 'print("Hello")',
          order_index: 1,
          created_at: '2024-01-01T00:00:00',
        },
        {
          id: 2,
          module_id: 1,
          title: 'Variables y Tipos',
          content: 'Las variables...',
          code_template: null,
          order_index: 2,
          created_at: '2024-01-01T00:00:00',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue(mockLessons);

      const result = await getAllLessons();

      expect(apiClient.get).toHaveBeenCalledWith('/api/lessons');
      expect(result).toEqual(mockLessons);
      expect(result).toHaveLength(2);
    });

    it('should handle errors when fetching all lessons', async () => {
      const errorMessage = 'Network error';
      (apiClient.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getAllLessons()).rejects.toThrow(errorMessage);
      expect(apiClient.get).toHaveBeenCalledWith('/api/lessons');
    });
  });

  describe('getLessonsByModule', () => {
    it('should fetch lessons for a specific module', async () => {
      const moduleId = 1;
      const mockLessons: Lesson[] = [
        {
          id: 1,
          module_id: 1,
          title: 'Lesson 1',
          content: 'Content 1',
          code_template: null,
          order_index: 1,
          created_at: '2024-01-01T00:00:00',
        },
      ];

      (apiClient.get as jest.Mock).mockResolvedValue(mockLessons);

      const result = await getLessonsByModule(moduleId);

      expect(apiClient.get).toHaveBeenCalledWith(`/api/lessons/module/${moduleId}`);
      expect(result).toEqual(mockLessons);
    });

    it('should handle errors when module not found', async () => {
      const moduleId = 999;
      const errorMessage = `No lessons found for module ${moduleId}`;
      (apiClient.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getLessonsByModule(moduleId)).rejects.toThrow();
      expect(apiClient.get).toHaveBeenCalledWith(`/api/lessons/module/${moduleId}`);
    });
  });

  describe('getLessonById', () => {
    it('should fetch detailed lesson information', async () => {
      const lessonId = 1;
      const mockLessonDetail: LessonDetail = {
        id: 1,
        module_id: 1,
        title: 'Introducción a Python',
        content: 'Python es un lenguaje...',
        code_template: 'print("Hello")',
        order_index: 1,
        created_at: '2024-01-01T00:00:00',
        content_blocks: [
          {
            id: 1,
            lesson_id: 1,
            content_type: 'theory',
            content_order: 1,
            title: '¿Qué es Python?',
            markdown_content: '# Python\nPython es...',
            code_example: null,
            code_language: 'python',
            created_at: '2024-01-01T00:00:00',
            updated_at: '2024-01-01T00:00:00',
          },
        ],
        objectives: [
          {
            id: 1,
            lesson_id: 1,
            objective_text: 'Comprender qué es Python',
            objective_order: 1,
            created_at: '2024-01-01T00:00:00',
          },
        ],
      };

      (apiClient.get as jest.Mock).mockResolvedValue(mockLessonDetail);

      const result = await getLessonById(lessonId);

      expect(apiClient.get).toHaveBeenCalledWith(`/api/lessons/${lessonId}`);
      expect(result).toEqual(mockLessonDetail);
      expect(result.content_blocks).toHaveLength(1);
      expect(result.objectives).toHaveLength(1);
    });

    it('should handle errors when lesson not found', async () => {
      const lessonId = 999;
      const errorMessage = `Lesson ${lessonId} not found`;
      (apiClient.get as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(getLessonById(lessonId)).rejects.toThrow();
      expect(apiClient.get).toHaveBeenCalledWith(`/api/lessons/${lessonId}`);
    });
  });

  describe('createLesson', () => {
    it('should create a new lesson successfully', async () => {
      const lessonData: LessonCreate = {
        module_id: 1,
        title: 'Nueva Lección',
        content: 'Contenido de la lección',
        code_template: '# Código inicial',
        order_index: 5,
      };

      const mockCreatedLesson: Lesson = {
        id: 12,
        ...lessonData,
        created_at: '2024-01-15T10:30:00',
      };

      (apiClient.post as jest.Mock).mockResolvedValue(mockCreatedLesson);

      const result = await createLesson(lessonData);

      expect(apiClient.post).toHaveBeenCalledWith('/api/lessons', lessonData);
      expect(result).toEqual(mockCreatedLesson);
      expect(result.id).toBe(12);
    });

    it('should handle validation errors when creating lesson', async () => {
      const lessonData: LessonCreate = {
        module_id: 1,
        title: '',
        content: 'Content',
        order_index: 1,
      };

      const errorMessage = 'Validation error: title cannot be empty';
      (apiClient.post as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(createLesson(lessonData)).rejects.toThrow();
      expect(apiClient.post).toHaveBeenCalledWith('/api/lessons', lessonData);
    });
  });

  describe('updateLesson', () => {
    it('should update a lesson successfully', async () => {
      const lessonId = 1;
      const updateData: LessonUpdate = {
        title: 'Título Actualizado',
        content: 'Contenido actualizado',
      };

      const mockUpdatedLesson: Lesson = {
        id: lessonId,
        module_id: 1,
        title: 'Título Actualizado',
        content: 'Contenido actualizado',
        code_template: 'print("Hello")',
        order_index: 1,
        created_at: '2024-01-01T00:00:00',
      };

      (apiClient.put as jest.Mock).mockResolvedValue(mockUpdatedLesson);

      const result = await updateLesson(lessonId, updateData);

      expect(apiClient.put).toHaveBeenCalledWith(`/api/lessons/${lessonId}`, updateData);
      expect(result).toEqual(mockUpdatedLesson);
      expect(result.title).toBe('Título Actualizado');
    });

    it('should handle errors when updating non-existent lesson', async () => {
      const lessonId = 999;
      const updateData: LessonUpdate = { title: 'New Title' };
      const errorMessage = `Lesson ${lessonId} not found`;
      
      (apiClient.put as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(updateLesson(lessonId, updateData)).rejects.toThrow();
      expect(apiClient.put).toHaveBeenCalledWith(`/api/lessons/${lessonId}`, updateData);
    });
  });

  describe('deleteLesson', () => {
    it('should delete a lesson successfully', async () => {
      const lessonId = 1;
      (apiClient.delete as jest.Mock).mockResolvedValue(undefined);

      await deleteLesson(lessonId);

      expect(apiClient.delete).toHaveBeenCalledWith(`/api/lessons/${lessonId}`);
    });

    it('should handle errors when deleting non-existent lesson', async () => {
      const lessonId = 999;
      const errorMessage = `Lesson ${lessonId} not found`;
      
      (apiClient.delete as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(deleteLesson(lessonId)).rejects.toThrow();
      expect(apiClient.delete).toHaveBeenCalledWith(`/api/lessons/${lessonId}`);
    });
  });
});
