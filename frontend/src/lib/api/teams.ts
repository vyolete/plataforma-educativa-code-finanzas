/**
 * API client for team management endpoints
 */

import { apiClient } from './client';

export interface TeamMember {
  id: number;
  userId: number;
  email: string;
  fullName: string;
  joinedAt: string;
}

export interface Team {
  id: number;
  name: string;
  semesterId: number;
  repositoryUrl?: string;
  leaderId: number;
  createdAt: string;
  memberCount?: number;
}

export interface TeamDetail extends Team {
  members: TeamMember[];
}

export interface CreateTeamData {
  name: string;
  semesterId: number;
}

export interface UpdateTeamData {
  name?: string;
  repositoryUrl?: string;
}

export interface InviteMemberData {
  email: string;
}

export interface InviteResponse {
  success: boolean;
  message: string;
  userId?: number;
}

/**
 * Create a new team
 */
export async function createTeam(data: CreateTeamData): Promise<TeamDetail> {
  const response = await apiClient.post('/api/teams', data);
  return response;
}

/**
 * Get all teams (filtered by semester for students)
 */
export async function getTeams(semesterId?: number): Promise<Team[]> {
  const params = semesterId ? { semester_id: semesterId } : undefined;
  const response = await apiClient.get('/api/teams', { params });
  return response;
}

/**
 * Get team details by ID
 */
export async function getTeam(teamId: number): Promise<TeamDetail> {
  const response = await apiClient.get(`/api/teams/${teamId}`);
  return response;
}

/**
 * Get current user's team
 */
export async function getMyTeam(): Promise<TeamDetail> {
  const response = await apiClient.get('/api/teams/my-team/current');
  return response;
}

/**
 * Update team details (name, repository URL)
 */
export async function updateTeam(teamId: number, data: UpdateTeamData): Promise<TeamDetail> {
  const response = await apiClient.put(`/api/teams/${teamId}`, data);
  return response;
}

/**
 * Invite a member to the team
 */
export async function inviteMember(teamId: number, data: InviteMemberData): Promise<InviteResponse> {
  const response = await apiClient.post(`/api/teams/${teamId}/invite`, data);
  return response;
}

/**
 * Join a team (accept invitation)
 */
export async function joinTeam(teamId: number): Promise<TeamDetail> {
  const response = await apiClient.post(`/api/teams/${teamId}/join`);
  return response;
}

/**
 * Remove a member from the team
 */
export async function removeMember(teamId: number, userId: number): Promise<void> {
  await apiClient.delete(`/api/teams/${teamId}/members/${userId}`);
}

// Export as object for convenience
export const teamsApi = {
  createTeam,
  getTeams,
  getTeam,
  getMyTeam,
  updateTeam,
  inviteMember,
  joinTeam,
  removeMember,
};
