import { apiClient } from './client';

export interface ProjectSubmission {
  id: number;
  team_id: number;
  semester_id: number;
  submission_type: 'trabajo_1' | 'trabajo_2' | 'concurso' | 'examen';
  notebook_url: string;
  status: 'pending' | 'confirmed' | 'graded';
  grade?: number;
  feedback?: string;
  submitted_at: string;
  due_date: string;
  is_late: boolean;
  confirmations: SubmissionConfirmation[];
}

export interface SubmissionConfirmation {
  id: number;
  submission_id: number;
  user_id: number;
  confirmed_at: string;
}

export interface ProjectSubmissionWithConfirmations extends ProjectSubmission {
  total_confirmations: number;
  required_confirmations: number;
  is_fully_confirmed: boolean;
}

export interface CreateSubmissionData {
  team_id: number;
  semester_id: number;
  submission_type: string;
  due_date: string;
  file: File;
}

export const submissionsApi = {
  /**
   * Create a new project submission
   */
  async createSubmission(data: CreateSubmissionData): Promise<ProjectSubmission> {
    const formData = new FormData();
    formData.append('team_id', data.team_id.toString());
    formData.append('semester_id', data.semester_id.toString());
    formData.append('submission_type', data.submission_type);
    formData.append('due_date', data.due_date);
    formData.append('file', data.file);

    const response = await apiClient.post('/submissions/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Confirm a submission as a team member
   */
  async confirmSubmission(submissionId: number): Promise<ProjectSubmission> {
    const response = await apiClient.post(`/submissions/${submissionId}/confirm`);
    return response.data;
  },

  /**
   * Get all submissions for a team
   */
  async getTeamSubmissions(teamId: number): Promise<ProjectSubmissionWithConfirmations[]> {
    const response = await apiClient.get(`/submissions/team/${teamId}`);
    return response.data;
  },

  /**
   * Get a specific submission by ID
   */
  async getSubmission(submissionId: number): Promise<ProjectSubmissionWithConfirmations> {
    const response = await apiClient.get(`/submissions/${submissionId}`);
    return response.data;
  },

  /**
   * Grade a submission (professor only)
   */
  async gradeSubmission(
    submissionId: number,
    grade: number,
    feedback?: string
  ): Promise<ProjectSubmission> {
    const formData = new FormData();
    formData.append('grade', grade.toString());
    if (feedback) {
      formData.append('feedback', feedback);
    }

    const response = await apiClient.put(`/submissions/${submissionId}/grade`, formData);
    return response.data;
  },

  /**
   * Get all submissions for a semester (professor only)
   */
  async getSemesterSubmissions(semesterId: number): Promise<ProjectSubmission[]> {
    const response = await apiClient.get(`/submissions/semester/${semesterId}`);
    return response.data;
  },
};
