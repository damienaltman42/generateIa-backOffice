export const APP_NAME = 'Sowat.io Admin'
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3010'
export const TOKEN_KEY = 'access_token'
export const REFRESH_TOKEN_KEY = 'refresh_token'

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
  PLANS: '/plans',
  PLAN_DETAIL: '/plans/:id',
  JOBS: '/jobs',
  SUBSCRIPTIONS: '/subscriptions',
  AUDIT: '/audit',
  SETTINGS: '/settings',
} as const

export const QUERY_KEYS = {
  USERS: 'users',
  USER_DETAIL: 'user-detail',
  PLANS: 'plans',
  PLAN_DETAIL: 'plan-detail',
  JOBS: 'jobs',
  SUBSCRIPTIONS: 'subscriptions',
  AUDIT_LOGS: 'audit-logs',
  DASHBOARD_STATS: 'dashboard-stats',
} as const 