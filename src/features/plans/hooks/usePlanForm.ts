import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { plansApi } from '../api/plansApi';
import type { UpdatePlanData, Plan, PlanFormData } from '../types/plans.types';

export const usePlanForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const createPlan = useMutation({
    mutationFn: plansApi.createPlan,
    onSuccess: (data: Plan) => {
      message.success(`Plan "${data.display_name}" créé avec succès`);
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      navigate('/plans');
    },
    onError: (error: Error) => {
      const errorMessage = (error as any).response?.data?.message || 'Erreur lors de la création du plan';
      message.error(errorMessage);
    },
  });

  const updatePlan = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlanData }) => 
      plansApi.updatePlan(id, data),
    onSuccess: (data: Plan) => {
      message.success(`Plan "${data.display_name}" mis à jour avec succès`);
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      queryClient.invalidateQueries({ queryKey: ['admin-plan', data.id] });
      navigate('/plans');
    },
    onError: (error: Error) => {
      const errorMessage = (error as any).response?.data?.message || 'Erreur lors de la mise à jour du plan';
      message.error(errorMessage);
    },
  });

  return {
    createPlan,
    updatePlan,
  };
}; 