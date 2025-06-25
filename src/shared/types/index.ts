export interface User {
  id: string
  email: string
  name: string
  company?: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
  subscription?: Subscription
  articlesConsumed?: number
  socialPostsConsumed?: number
  storiesConsumed?: number
}

export interface Plan {
  id: string
  name: string
  priceMonthly: number
  priceYearly: number
  articleLimit: number
  socialPostLimit: number
  storyLimit: number
  description?: string
  features?: string[]
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  plan?: Plan
  status: SubscriptionStatus
  stripeSubscriptionId?: string
  currentPeriodStart: string
  currentPeriodEnd: string
  canceledAt?: string
  extraArticlesPurchased: number
  extraSocialPostsPurchased: number
  extraStoriesPurchased: number
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
  PAST_DUE = 'past_due',
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  entityType: string
  entityId: string
  oldData?: unknown
  newData?: unknown
  metadata?: unknown
  createdAt: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  mrr: number
  failedJobs: number
  pendingJobs: number
  articlesGenerated: number
  socialPostsGenerated: number
} 