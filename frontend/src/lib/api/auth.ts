import { apiClient } from './client';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'professor';
  semester_id: number | null;
  created_at: string;
}

export interface LoginRequest {
  username: string; // email
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  invitation_token: string;
}

export interface InvitationValidation {
  valid: boolean;
  email: string;
  semester_name: string;
  expires_at: string;
}

export const authApi = {
  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    // FastAPI OAuth2PasswordRequestForm expects form data
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data: LoginResponse = await response.json();
    apiClient.setToken(data.access_token);
    return data;
  },

  /**
   * Register a new user with invitation token
   */
  async register(data: RegisterRequest): Promise<User> {
    const user = await apiClient.post<User>('/api/auth/register', data);
    return user;
  },

  /**
   * Get current user information
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/api/auth/me');
  },

  /**
   * Logout (client-side token removal)
   */
  logout(): void {
    apiClient.setToken(null);
  },

  /**
   * Validate an invitation token
   */
  async validateInvitation(token: string): Promise<InvitationValidation> {
    return apiClient.get<InvitationValidation>(`/api/auth/validate-invitation/${token}`);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.getToken() !== null;
  },
};
