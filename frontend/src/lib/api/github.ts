/**
 * API client for GitHub OAuth integration
 */

import { apiClient } from './client';

export interface GitHubConnectResponse {
  success: boolean;
  message: string;
  github_username?: string;
  github_name?: string;
}

export interface GitHubStatusResponse {
  connected: boolean;
  github_username?: string;
  github_name?: string;
  github_avatar?: string;
}

export interface RepositoryInfo {
  name: string;
  full_name: string;
  description?: string;
  private: boolean;
  url: string;
  stars: number;
  forks: number;
  language?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RepositoryLinkResponse {
  success: boolean;
  message: string;
  repository_url?: string;
  repository_info?: RepositoryInfo;
}

/**
 * Connect GitHub account using OAuth authorization code
 */
export async function connectGitHub(code: string): Promise<GitHubConnectResponse> {
  return apiClient.post('/api/auth/github/connect', { code });
}

/**
 * Disconnect GitHub account
 */
export async function disconnectGitHub(): Promise<{ success: boolean; message: string }> {
  return apiClient.post('/api/auth/github/disconnect');
}

/**
 * Get GitHub connection status
 */
export async function getGitHubStatus(): Promise<GitHubStatusResponse> {
  return apiClient.get('/api/auth/github/status');
}

/**
 * Link a GitHub repository to a team
 */
export async function linkRepository(
  teamId: number,
  repositoryUrl: string
): Promise<RepositoryLinkResponse> {
  return apiClient.put(`/api/teams/${teamId}/repository`, { repository_url: repositoryUrl });
}

/**
 * Unlink repository from team
 */
export async function unlinkRepository(teamId: number): Promise<{ success: boolean; message: string }> {
  return apiClient.delete(`/api/teams/${teamId}/repository`);
}

/**
 * Get repository information for a team
 */
export async function getTeamRepository(teamId: number): Promise<RepositoryLinkResponse> {
  return apiClient.get(`/api/teams/${teamId}/repository`);
}

/**
 * Generate GitHub OAuth authorization URL
 */
export function getGitHubAuthUrl(redirectUri: string): string {
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  if (!clientId) {
    throw new Error('GitHub Client ID not configured');
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user:email',
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}
