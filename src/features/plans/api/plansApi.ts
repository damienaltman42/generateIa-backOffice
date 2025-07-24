import api from '../../../shared/api/client';
import type { 
  PlansListParams, 
  PlansListResponse, 
  Plan,
  CreatePlanData,
  UpdatePlanData,
  ActionResponse,
  SyncResponse
} from '../types/plans.types';

export const plansApi = {
  // Récupérer la liste des plans
  getPlans: async (params: PlansListParams = {}): Promise<PlansListResponse> => {
    const response = await api.get('/admin/plans', { params });
    return response.data;
  },

  // Récupérer le détail d'un plan
  getPlan: async (planId: string): Promise<Plan> => {
    const response = await api.get(`/admin/plans/${planId}`);
    return response.data;
  },

  // Créer un nouveau plan
  createPlan: async (data: CreatePlanData): Promise<Plan> => {
    const response = await api.post('/admin/plans', data);
    return response.data;
  },

  // Mettre à jour un plan
  updatePlan: async (planId: string, data: UpdatePlanData): Promise<Plan> => {
    const response = await api.put(`/admin/plans/${planId}`, data);
    return response.data;
  },

  // Supprimer un plan
  deletePlan: async (planId: string): Promise<ActionResponse> => {
    const response = await api.delete(`/admin/plans/${planId}`);
    return response.data;
  },

  // Synchroniser tous les plans avec Stripe
  syncAllPlans: async (dryRun: boolean = false): Promise<SyncResponse> => {
    const response = await api.get('/admin/plans/actions/sync', null, {
      params: { dryRun: dryRun.toString() }
    });
    return response.data;
  },

  // Vérifier le statut de synchronisation
  getSyncStatus: async (): Promise<SyncResponse> => {
    const response = await api.get('/admin/plans/sync/status');
    return response.data;
  },

  // Récupérer les produits Stripe
  getStripeProducts: async () => {
    const response = await api.get('/admin/plans/stripe/products');
    return response.data;
  },
}; 