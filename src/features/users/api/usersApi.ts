import api from '../../../shared/api/client';
import type { 
  UsersListParams, 
  UsersListResponse, 
  User,
  UpdateUserRightsData,
  UpdateUserQuotasData,
  SuspendUserData,
  ResetPasswordData,
  ActionResponse
} from '../types/users.types';

export const usersApi = {
  // Récupérer la liste des utilisateurs
  getUsers: async (params: UsersListParams = {}): Promise<UsersListResponse> => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Récupérer le détail d'un utilisateur
  getUser: async (userId: string): Promise<User> => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  // Récupérer l'historique de consommation
  getConsumptionHistory: async (
    userId: string, 
    params?: {
      period?: 'day' | 'month' | 'year';
      startDate?: string;
      endDate?: string;
      limit?: number;
    }
  ) => {
    const response = await api.get(`/admin/users/${userId}/consumption-history`, { params });
    return response.data;
  },

  // Récupérer les logs d'audit
  getAuditLogs: async (
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      action?: string;
      dateFrom?: string;
      dateTo?: string;
      adminId?: string;
    }
  ) => {
    const response = await api.get(`/admin/users/${userId}/audit-logs`, { params });
    return response.data;
  },

  // Récupérer les ressources créées
  getResources: async (
    userId: string,
    params?: {
      page?: number;
      limit?: number;
      type?: 'article' | 'social_post' | 'image';
      groupBy?: 'type' | 'date' | 'status';
      dateFrom?: string;
      dateTo?: string;
    }
  ) => {
    const response = await api.get(`/admin/users/${userId}/resources`, { params });
    return response.data;
  },

  // Actions sur les utilisateurs
  updateRights: async (userId: string, data: UpdateUserRightsData): Promise<ActionResponse> => {
    const response = await api.patch(`/admin/users/${userId}/rights`, data);
    return response.data;
  },

  updateQuotas: async (userId: string, data: UpdateUserQuotasData): Promise<ActionResponse> => {
    const response = await api.patch(`/admin/users/${userId}/quotas`, data);
    return response.data;
  },

  suspendUser: async (userId: string, data: SuspendUserData): Promise<ActionResponse> => {
    const response = await api.patch(`/admin/users/${userId}/suspend`, data);
    return response.data;
  },

  resetPassword: async (userId: string, data: ResetPasswordData): Promise<ActionResponse> => {
    const response = await api.post(`/admin/users/${userId}/reset-password`, data);
    return response.data;
  },
}; 