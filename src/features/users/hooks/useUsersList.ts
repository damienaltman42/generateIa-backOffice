import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/usersApi';
import type { UsersListParams } from '../types/users.types';

export const useUsersList = (params: UsersListParams = {}) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
  });
}; 