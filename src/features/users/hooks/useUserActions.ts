import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { App, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { usersApi } from '../api/usersApi';
import type {
  UpdateUserRightsData,
  UpdateUserQuotasData,
  SuspendUserData,
  ResetPasswordData,
  ApiError,
} from '../types/users.types';

// Rate limiting helper
const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests: number[] = [];
  
  return () => {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Nettoyer les anciennes requêtes
    while (requests.length > 0 && requests[0] < windowStart) {
      requests.shift();
    }
    
    if (requests.length >= maxRequests) {
      return false;
    }
    
    requests.push(now);
    return true;
  };
};

// Créer des limiteurs pour chaque type d'action
const rateLimiters = {
  updateRights: createRateLimiter(2, 60000), // 2 requêtes par minute
  updateQuotas: createRateLimiter(5, 60000), // 5 requêtes par minute
  suspendUser: createRateLimiter(3, 60000), // 3 requêtes par minute
  resetPassword: createRateLimiter(3, 300000), // 3 requêtes par 5 minutes
};

// Vérification des permissions (simulée côté client)
const checkPermission = (action: string, currentUser?: { isAdmin: boolean }) => {
  // En production, cela devrait être vérifié côté serveur
  if (!currentUser?.isAdmin) {
    message.error('Vous n\'avez pas les permissions pour effectuer cette action');
    return false;
  }
  return true;
};

interface UseUserActionsOptions {
  onSuccess?: () => void;
  onError?: (error: ApiError) => void;
}

export const useUserActions = (userId: string, options?: UseUserActionsOptions) => {
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const currentUser = { isAdmin: true }; // TODO: Récupérer depuis le contexte d'auth

  const showSuccessNotification = (message: string, description?: string) => {
    notification.success({
      message,
      description,
      icon: React.createElement(CheckCircleOutlined, { style: { color: '#52c41a' } }),
      placement: 'topRight',
      duration: 4,
    });
  };

  const showErrorNotification = (message: string, description?: string) => {
    notification.error({
      message,
      description,
      icon: React.createElement(CloseCircleOutlined, { style: { color: '#ff4d4f' } }),
      placement: 'topRight',
      duration: 6,
    });
  };

  const updateRights = useMutation({
    mutationFn: async (data: UpdateUserRightsData) => {
      if (!checkPermission('updateRights', currentUser)) {
        throw new Error('Permission refusée');
      }
      
      if (!rateLimiters.updateRights()) {
        throw new Error('Trop de requêtes. Veuillez patienter avant de réessayer.');
      }
      
      return usersApi.updateRights(userId, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      showSuccessNotification(
        'Droits modifiés avec succès',
        response.message || `Les droits de l'utilisateur ont été mis à jour.`
      );
      options?.onSuccess?.();
    },
    onError: (error: ApiError) => {
      showErrorNotification(
        'Erreur lors de la modification des droits',
        error.response?.data?.message || 'Une erreur inattendue est survenue. Veuillez réessayer.'
      );
      options?.onError?.(error);
    },
  });

  const updateQuotas = useMutation({
    mutationFn: async (data: UpdateUserQuotasData) => {
      if (!checkPermission('updateQuotas', currentUser)) {
        throw new Error('Permission refusée');
      }
      
      if (!rateLimiters.updateQuotas()) {
        throw new Error('Trop de requêtes. Veuillez patienter avant de réessayer.');
      }
      
      return usersApi.updateQuotas(userId, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      const quotasAdded = [];
      const added = response.details?.added;
      if (added?.articles) {
        quotasAdded.push(`${added.articles} articles`);
      }
      if (added?.social_posts) {
        quotasAdded.push(`${added.social_posts} posts`);
      }
      if (added?.stories) {
        quotasAdded.push(`${added.stories} stories`);
      }

      showSuccessNotification(
        'Crédits ajoutés avec succès',
        quotasAdded.length > 0 ? `Ajout de : ${quotasAdded.join(', ')}` : response.message
      );
      
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      showErrorNotification(
        'Erreur lors de l\'ajout des crédits',
        error.message
      );
      options?.onError?.(error);
    },
  });

  const suspendUser = useMutation({
    mutationFn: async (data: SuspendUserData) => {
      if (!checkPermission('suspendUser', currentUser)) {
        throw new Error('Permission refusée');
      }
      
      if (!rateLimiters.suspendUser()) {
        throw new Error('Trop de requêtes. Veuillez patienter avant de réessayer.');
      }
      
      return usersApi.suspendUser(userId, data);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      
      const status = response.details?.status || response.user?.status;
      const action = status === 'suspended' ? 'suspendu' : 'réactivé';
      showSuccessNotification(
        `Utilisateur ${action} avec succès`,
        response.message
      );
      
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      showErrorNotification(
        'Erreur lors de la suspension/réactivation',
        error.message
      );
      options?.onError?.(error);
    },
  });

  const resetPassword = useMutation({
    mutationFn: async (data: ResetPasswordData) => {
      if (!checkPermission('resetPassword', currentUser)) {
        throw new Error('Permission refusée');
      }
      
      if (!rateLimiters.resetPassword()) {
        throw new Error('Trop de requêtes. Veuillez patienter avant de réessayer.');
      }
      
      return usersApi.resetPassword(userId, data);
    },
    onSuccess: () => {
      showSuccessNotification(
        'Mot de passe réinitialisé',
        'Un email a été envoyé à l\'utilisateur avec les instructions'
      );
      
      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      showErrorNotification(
        'Erreur lors de la réinitialisation',
        error.message
      );
      options?.onError?.(error);
    },
  });

  return {
    updateRights,
    updateQuotas,
    suspendUser,
    resetPassword,
  };
}; 