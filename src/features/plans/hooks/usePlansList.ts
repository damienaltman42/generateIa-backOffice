import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { plansApi } from '../api/plansApi';
import type { PlansListParams, ActionResponse } from '../types/plans.types';

export const usePlansList = (params: PlansListParams = {}) => {
  return useQuery({
    queryKey: ['admin-plans', params],
    queryFn: () => plansApi.getPlans(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePlanDetail = (planId: string) => {
  return useQuery({
    queryKey: ['admin-plan', planId],
    queryFn: () => plansApi.getPlan(planId),
    enabled: !!planId,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePlanActions = () => {
  const queryClient = useQueryClient();

  const deletePlan = useMutation({
    mutationFn: plansApi.deletePlan,
    onSuccess: (data: ActionResponse) => {
      message.success(data.message || 'Plan supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la suppression';
      message.error(errorMessage);
    },
  });

  const syncAllPlans = useMutation({
    mutationFn: ({ dryRun }: { dryRun: boolean }) => plansApi.syncAllPlans(dryRun),
    onSuccess: (data) => {
      if (data.success) {
        const summary = data.results?.summary;
        if (summary) {
          message.success(
            `Synchronisation terminée: ${summary.synced} synchronisés, ${summary.skipped} ignorés, ${summary.failed} échecs`
          );
        } else {
          message.success('Synchronisation terminée avec succès');
        }
      } else {
        message.error(data.error?.message || 'Erreur lors de la synchronisation');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erreur lors de la synchronisation';
      message.error(errorMessage);
    },
  });

  return {
    deletePlan,
    syncAllPlans,
  };
}; 