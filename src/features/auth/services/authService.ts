import apiClient from '../../../shared/api/client';
import { User } from '../../../shared/types';

interface LoginResponse {
  access_token: string;
  refresh_token?: string;
  user: User;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token?: string;
}

class AuthService {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/admin/login', {
      email,
      password,
    });
    return response.data;
  }

  async logout(): Promise<void> {
    // Optionnel : appeler un endpoint de logout côté serveur
    // Pour l'instant, le logout est géré côté client uniquement
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/profile');
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/admin/forgot-password', {
      email,
    });
    return response.data;
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>('/admin/reset-password', {
      token,
      password: newPassword,
    });
    return response.data;
  }
}

export const authService = new AuthService(); 