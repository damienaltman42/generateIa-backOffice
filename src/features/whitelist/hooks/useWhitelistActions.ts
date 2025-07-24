import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { whitelistApi } from '../api/whitelistApi';
import type { MigrateUserRequest, MigrateBatchRequest } from '../types/whitelist.types';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useWhitelistActions = () => {
  const queryClient = useQueryClient();

  const migrateSingle = useMutation({
    mutationFn: (data: MigrateUserRequest) => whitelistApi.migrateUser(data),
    onSuccess: (response) => {
      message.success(`Utilisateur migré avec succès. ID: ${response.userId}`);
      // Invalider les caches pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['whitelist'] });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || 'Erreur lors de la migration';
      message.error(errorMessage);
    },
  });

  const migrateBatch = useMutation({
    mutationFn: (data: MigrateBatchRequest) => whitelistApi.migrateBatch(data),
    onSuccess: (response) => {
      message.success(
        `Migration en lot terminée. ${response.successful} utilisateurs migrés, ${response.failed} échecs.`
      );
      // Invalider les caches pour rafraîchir les données
      queryClient.invalidateQueries({ queryKey: ['whitelist'] });
    },
    onError: (error: ApiError) => {
      const errorMessage = error?.response?.data?.message || 'Erreur lors de la migration en lot';
      message.error(errorMessage);
    },
  });

  return {
    migrateSingle,
    migrateBatch,
  };
}; 