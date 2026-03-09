/**
 * TypeScript types for lesson data
 * Matches backend Pydantic schemas from backend/app/schemas/lesson.py
 */

/**
 * Content block within a lesson
 * Corresponds to LessonContentResponse in backend
 */
export interface LessonContent {
  id: number;
  lesson_id: number;
  content_type: 'theory' | 'example' | 'exercise' | 'tip' | 'warning' | 'code';
  content_order: number;
  title: string | null;
  markdown_content: string;
  code_example: string | null;
  code_language: string;
  created_at: string;
  updated_at: string;
}

/**
 * Learning objective for a lesson
 * Corresponds to LessonObjectiveResponse in backend
 */
export interface LessonObjective {
  id: number;
  lesson_id: number;
  objective_text: string;
  objective_order: number;
  created_at: string;
}

/**
 * Basic lesson information for list views
 * Corresponds to LessonResponse in backend
 */
export interface Lesson {
  id: number;
  module_id: number;
  title: string;
  content: string;
  code_template: string | null;
  order_index: number;
  created_at: string;
}

/**
 * Detailed lesson information including content blocks and objectives
 * Corresponds to LessonDetailResponse in backend
 */
export interface LessonDetail {
  id: number;
  module_id: number;
  title: string;
  content: string;
  code_template: string | null;
  order_index: number;
  created_at: string;
  content_blocks: LessonContent[];
  objectives: LessonObjective[];
}

/**
 * Data for creating a new lesson
 * Corresponds to LessonCreate in backend
 */
export interface LessonCreate {
  module_id: number;
  title: string;
  content: string;
  code_template?: string | null;
  order_index: number;
}

/**
 * Data for updating an existing lesson
 * Corresponds to LessonUpdate in backend
 */
export interface LessonUpdate {
  title?: string;
  content?: string;
  code_template?: string | null;
  order_index?: number;
}
