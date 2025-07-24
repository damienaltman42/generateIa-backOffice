import apiClient from '@/shared/api/client';
import type { 
  DashboardOverview, 
  DashboardPeriod, 
  Alert,
  UserGrowthData,
  MRREvolutionData,
  UsageTimelineData
} from '../types/dashboard.types';

export const dashboardApi = {
  getOverview: async (period: DashboardPeriod = '30d', compare = false) => {
    const response = await apiClient.get<DashboardOverview>('/admin/dashboard/overview', {
      params: { period, compare },
    });
    return response.data;
  },

  getUsersMetrics: async (period: DashboardPeriod = '30d') => {
    const response = await apiClient.get<{
      activeUsers: number;
      newUsers: number;
      totalUsers: number;
      proUsers: number;
      conversionRate: number;
      charts: {
        userGrowth: UserGrowthData[];
      };
    }>('/admin/dashboard/users-metrics', {
      params: { period },
    });
    return response.data;
  },

  getFinancialMetrics: async (period: DashboardPeriod = '30d') => {
    const response = await apiClient.get<{
      mrr: number;
      mrrGrowth: number;
      arpu: number;
      churnRate: number;
      charts: {
        mrrEvolution: MRREvolutionData[];
      };
    }>('/admin/dashboard/financial-metrics', {
      params: { period },
    });
    return response.data;
  },

  getUsageMetrics: async (period: DashboardPeriod = '30d') => {
    const response = await apiClient.get<{
      articlesGenerated: number;
      socialPostsCreated: number;
      quotaUsage: number;
      charts: {
        usageTimeline: UsageTimelineData[];
      };
    }>('/admin/dashboard/usage-metrics', {
      params: { period },
    });
    return response.data;
  },

  getSystemMetrics: async () => {
    const response = await apiClient.get('/admin/dashboard/system-metrics');
    return response.data;
  },

  getAlerts: async () => {
    const response = await apiClient.get<Alert[]>('/admin/dashboard/alerts');
    return response.data;
  },
}; 