export interface Plan {
  id: string;
  name: string;
  display_name: string;
  articles_limit: number;
  social_posts_limit: number;
  stories_limit: number;
  monthly_price: string;
  yearly_price: string;
  yearly_discount_percent: number;
  trial_days: number;
  cumulation_max_percent: number;
  extra_article_price: string;
  extra_social_post_price: string;
  extra_story_price: string;
  features: PlanFeatures;
  is_active: boolean;
  stripe_product_id: string | null;
  stripe_price_id_monthly: string | null;
  stripe_price_id_yearly: string | null;
  stripe_sync_status: 'pending' | 'synced' | 'failed' | 'outdated';
  is_stripe_valid: boolean;
  last_sync_at: string | null;
  sync_error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanFeatures {
  features: PlanFeature[];
}

export interface PlanFeature {
  key: string;
  text: {
    fr: string;
    en: string;
    he: string;
  };
  included: boolean;
  category: 'content' | 'distribution' | 'support';
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PlansListParams {
  page?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  stripe_sync_status?: 'pending' | 'synced' | 'failed' | 'outdated';
  sort_by?: string;
  sort_order?: 'ASC' | 'DESC';
}

export interface PlansListResponse {
  data: Plan[];
  meta: PaginationMeta;
}

export interface CreatePlanData {
  name: string;
  display_name: string;
  articles_limit: number;
  social_posts_limit: number;
  stories_limit: number;
  monthly_price: number;
  yearly_price: number;
  yearly_discount_percent: number;
  trial_days?: number;
  cumulation_max_percent?: number;
  extra_article_price?: number;
  extra_social_post_price?: number;
  extra_story_price?: number;
  features?: PlanFeatures;
  is_active?: boolean;
}

export interface UpdatePlanData {
  name?: string;
  display_name?: string;
  articles_limit?: number;
  social_posts_limit?: number;
  stories_limit?: number;
  monthly_price?: number;
  yearly_price?: number;
  yearly_discount_percent?: number;
  trial_days?: number;
  cumulation_max_percent?: number;
  extra_article_price?: number;
  extra_social_post_price?: number;
  extra_story_price?: number;
  features?: PlanFeatures;
  is_active?: boolean;
}

export interface PlanFormData {
  name: string;
  display_name: string;
  articles_limit: number;
  social_posts_limit: number;
  stories_limit: number;
  monthly_price: number;
  yearly_price: number;
  yearly_discount_percent: number;
  trial_days: number;
  cumulation_max_percent: number;
  extra_article_price: number;
  extra_social_post_price: number;
  extra_story_price: number;
  features: PlanFeatures;
  is_active: boolean;
}

export interface ActionResponse {
  message: string;
  success?: boolean;
}

export interface SyncResponse {
  success: boolean;
  timestamp: string;
  results?: {
    plans: Record<string, unknown>[];
    credits: Record<string, unknown>[];
    summary: {
      total: number;
      synced: number;
      skipped: number;
      failed: number;
    };
  };
  error?: {
    message: string;
    details: string;
  };
} 