// Types pour la gestion des utilisateurs

// Enums
export enum UserStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  TRIAL = 'trial',
  EXPIRED = 'expired',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum SortField {
  CREATED_AT = 'createdAt',
  NAME = 'name',
  EMAIL = 'email',
  ARTICLES_USED = 'articles_used',
  SOCIAL_POSTS_USED = 'social_posts_used',
  STORIES_USED = 'stories_used',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// Types de base
export interface Plan {
  id: string;
  name: string;
  display_name: string;
  articles_limit: number;
  social_posts_limit: number;
  stories_limit: number;
  monthly_price: number;
  yearly_price: number;
}

export interface Subscription {
  id: string;
  status: string;
  billing_cycle: 'monthly' | 'yearly';
  trial_start: string | null;
  trial_end: string | null;
  current_period_start: string;
  current_period_end: string;
  canceled_at: string | null;
  articles_cumulated: number;
  social_posts_cumulated: number;
  stories_cumulated: number;
  extra_articles_purchased: number;
  extra_social_posts_purchased: number;
  extra_stories_purchased: number;
}

export interface ConsumptionPercentage {
  articles: number;
  social_posts: number;
  stories: number;
  overall: number;
}

export interface EffectiveLimits {
  articles: number;
  social_posts: number;
  stories: number;
}

export interface ResourcesCount {
  articles: number;
  social_posts: number;
  stories: number;
  images: number;
}

// Type principal User
export interface User {
  id: string;
  email: string;
  name: string;
  company: string | null;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  emailVerified?: boolean;
  
  // Consommation
  articles_used: number;
  social_posts_used: number;
  stories_used: number;
  additional_articles: number;
  additional_social_posts: number;
  additional_stories: number;
  
  // Relations
  subscription: Subscription | null;
  plan: Plan | null;
  
  // Statistiques calculées
  consumption_percentage: ConsumptionPercentage;
  effective_limits: EffectiveLimits;
  status: UserStatus;
  total_resources_created: ResourcesCount;
}

// Types pour les requêtes
export interface UsersListParams {
  page?: number;
  limit?: number;
  email?: string;
  name?: string;
  status?: UserStatus;
  plan?: 'free' | 'pro';
  dateFrom?: string;
  dateTo?: string;
  role?: UserRole;
  consumptionThreshold?: number;
  sortBy?: SortField;
  sortOrder?: SortOrder;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface UsersListResponse {
  data: User[];
  meta: PaginationMeta;
}

// Types pour les actions
export interface UpdateUserRightsData {
  isAdmin: boolean;
  reason?: string;
}

export interface UpdateUserQuotasData {
  extraArticles: number;
  extraSocialPosts: number;
  extraStories: number;
  reason?: string;
}

export interface SuspendUserData {
  action: 'suspend' | 'reactivate';
  reason: string;
  endDate?: string;
  notifyUser?: boolean;
}

export interface ResetPasswordData {
  customMessage?: string;
}

export interface ApiError {
  response?: {
    data?: {
      message?: string;
      error?: string;
    };
  };
  message?: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  userId?: string;
  action?: string;
  details?: {
    isAdmin?: boolean;
    status?: string;
    email_sent_to?: string;
    added?: {
      articles: number;
      social_posts: number;
      stories: number;
    };
    new_totals?: {
      extra_articles: number;
      extra_social_posts: number;
      extra_stories: number;
    };
  };
  user?: User;
}

// Types pour l'historique et les logs
export interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  action_label?: string;
  details?: string;
  admin_id?: string;
  admin_name?: string;
  ip_address?: string;
  created_at: string;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ConsumptionHistoryItem {
  month: string;
  articles: number;
  social_posts: number;
  stories: number;
  total: number;
  trend?: number;
}

export interface ConsumptionHistoryResponse {
  data: ConsumptionHistoryItem[];
  comparison: Array<{
    period: string;
    total: number;
  }>;
  details: ConsumptionHistoryItem[];
} 