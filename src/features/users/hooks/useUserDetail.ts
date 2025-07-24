import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import type { User } from '../types/users.types';

export const useUserDetail = (userId: string) => {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => usersApi.getUser(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (gcTime remplace cacheTime dans React Query v5)
    refetchOnWindowFocus: true, // Refetch quand la fenêtre reprend le focus
    refetchOnReconnect: true, // Refetch après reconnexion réseau
  });
};

export const useUserConsumptionHistory = (
  userId: string,
  params?: {
    period?: 'day' | 'month' | 'year';
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
) => {
  return useQuery({
    queryKey: ['user', userId, 'consumption-history', params],
    queryFn: () => usersApi.getConsumptionHistory(userId, params),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserAuditLogs = (
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
  return useQuery({
    queryKey: ['user', userId, 'audit-logs', params],
    queryFn: () => usersApi.getAuditLogs(userId, params),
    enabled: !!userId,
  });
};

export const useUserResources = (
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
  return useQuery({
    queryKey: ['user', userId, 'resources', params],
    queryFn: () => usersApi.getResources(userId, params),
    enabled: !!userId,
  });
}; 