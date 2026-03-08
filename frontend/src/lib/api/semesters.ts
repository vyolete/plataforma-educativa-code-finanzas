import { apiClient } from './client';

export interface Semester {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'archived';
  duration_weeks: number | null;
  created_at: string;
}

export interface SemesterCreate {
  name: string;
  start_date: string;
  end_date: string;
}

export interface SemesterUpdate {
  name?: string;
  start_date?: string;
  end_date?: string;
  status?: 'active' | 'archived';
}

export interface DueDates {
  trabajo_1: string;
  trabajo_2: string;
  concurso: string;
  examen_final: string;
}

export const semestersApi = {
  /**
   * Create a new semester (professors only)
   */
  async create(data: SemesterCreate): Promise<Semester> {
    return apiClient.post<Semester>('/api/semesters', data);
  },

  /**
   * Get all semesters
   */
  async getAll(): Promise<Semester[]> {
    return apiClient.get<Semester[]>('/api/semesters');
  },

  /**
   * Get active semester
   */
  async getActive(): Promise<Semester> {
    return apiClient.get<Semester>('/api/semesters/active');
  },

  /**
   * Get semester by ID
   */
  async getById(id: number): Promise<Semester> {
    return apiClient.get<Semester>(`/api/semesters/${id}`);
  },

  /**
   * Get due dates for a semester
   */
  async getDueDates(id: number): Promise<DueDates> {
    return apiClient.get<DueDates>(`/api/semesters/${id}/due-dates`);
  },

  /**
   * Update semester (professors only)
   */
  async update(id: number, data: SemesterUpdate): Promise<Semester> {
    return apiClient.put<Semester>(`/api/semesters/${id}`, data);
  },

  /**
   * Archive a semester (professors only)
   */
  async archive(id: number): Promise<Semester> {
    return apiClient.post<Semester>(`/api/semesters/${id}/archive`);
  },

  /**
   * Activate a semester (professors only)
   */
  async activate(id: number): Promise<Semester> {
    return apiClient.post<Semester>(`/api/semesters/${id}/activate`);
  },

  /**
   * Delete a semester (professors only)
   */
  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`/api/semesters/${id}`);
  },
};
