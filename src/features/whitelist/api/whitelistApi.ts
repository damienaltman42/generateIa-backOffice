import api from '../../../shared/api/client';
import type {
  WhitelistStats,
  WhitelistListResponse,
  WhitelistQueryParams,
  MigrateUserRequest,
  MigrateUserResponse,
  MigrateBatchRequest,
  MigrateBatchResponse,
} from '../types/whitelist.types';

export const whitelistApi = {
  // Récupérer la liste des entrées whitelist avec pagination et filtres
  getList: async (params: WhitelistQueryParams): Promise<WhitelistListResponse> => {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    if (params.confirmed !== undefined) searchParams.append('confirmed', params.confirmed.toString());
    if (params.migrated !== undefined) searchParams.append('migrated', params.migrated.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.sortOrder) searchParams.append('sortOrder', params.sortOrder);

    const response = await api.get(`/admin/whitelist?${searchParams.toString()}`);
    return response.data;
  },

  // Récupérer les statistiques de la whitelist
  getStats: async (): Promise<WhitelistStats> => {
    const response = await api.get('/admin/whitelist/stats');
    return response.data;
  },

  // Migrer un utilisateur individuel
  migrateUser: async (data: MigrateUserRequest): Promise<MigrateUserResponse> => {
    const response = await api.post(`/admin/whitelist/${data.whitelistId}/migrate`, {
      reason: data.reason
    });
    return response.data;
  },

  // Migration en lot d'utilisateurs
  migrateBatch: async (data: MigrateBatchRequest): Promise<MigrateBatchResponse> => {
    const response = await api.post('/admin/whitelist/migrate-batch', data);
    return response.data;
  },
}; 