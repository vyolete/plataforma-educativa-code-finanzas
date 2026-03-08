import { apiClient } from './client';

export interface Grade {
  id: number;
  user_id: number;
  semester_id: number;
  trabajo_1: number | null;
  trabajo_2: number | null;
  concurso: number | null;
  examen: number | null;
  seguimiento: number | null;
  final_grade: number;
  updated_at: string;
}

export interface GradeWithUser extends Grade {
  user_email: string;
  user_name: string;
}

export interface GradeUpdate {
  trabajo_1?: number;
  trabajo_2?: number;
  concurso?: number;
  examen?: number;
  seguimiento?: number;
}

/**
 * Get current user's grades
 */
export async function getMyGrades(): Promise<Grade> {
  const response = await apiClient.get('/grades/me');
  return response.data;
}

/**
 * Update grades for a specific user (professor only)
 */
export async function updateUserGrades(userId: number, grades: GradeUpdate): Promise<Grade> {
  const response = await apiClient.put(`/grades/${userId}`, grades);
  return response.data;
}

/**
 * Get all grades for a semester (professor only)
 */
export async function getSemesterGrades(semesterId: number): Promise<GradeWithUser[]> {
  const response = await apiClient.get(`/grades/semester/${semesterId}`);
  return response.data;
}

/**
 * Recalculate seguimiento for a specific user (professor only)
 */
export async function recalculateSeguimiento(userId: number): Promise<Grade> {
  const response = await apiClient.post(`/grades/calculate-seguimiento/${userId}`);
  return response.data;
}

/**
 * Recalculate seguimiento for all users in a semester (professor only)
 */
export async function recalculateSemesterSeguimiento(semesterId: number): Promise<{
  message: string;
  total_students: number;
  updated: number;
}> {
  const response = await apiClient.post(`/grades/calculate-seguimiento/semester/${semesterId}`);
  return response.data;
}

/**
 * Export semester grades as CSV (professor only)
 */
export async function exportSemesterGrades(semesterId: number): Promise<Blob> {
  const response = await apiClient.get(`/grades/export/semester/${semesterId}`, {
    responseType: 'blob'
  });
  return response.data;
}
