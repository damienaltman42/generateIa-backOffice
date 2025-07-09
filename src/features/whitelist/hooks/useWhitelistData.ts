import { useQuery } from '@tanstack/react-query';
import { whitelistApi } from '../api/whitelistApi';
import type { WhitelistQueryParams } from '../types/whitelist.types';

export const useWhitelistList = (params: WhitelistQueryParams) => {
  return useQuery({
    queryKey: ['whitelist', 'list', params],
    queryFn: () => whitelistApi.getList(params),
    staleTime: 30000, // 30 secondes
    gcTime: 300000, // 5 minutes
  });
};

export const useWhitelistStats = () => {
  return useQuery({
    queryKey: ['whitelist', 'stats'],
    queryFn: () => whitelistApi.getStats(),
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  });
}; 