export interface DashboardOverview {
  period: string;
  compare: boolean;
  lastUpdated: Date;
  metrics: {
    users: UserMetrics;
    financial: FinancialMetrics;
    usage: UsageMetrics;
    system: SystemMetrics;
  };
}

export interface UserMetrics {
  activeToday: number;
  active7d: number;
  active30d: number;
  newUsers: number;
  comparison?: {
    newUsers: number;
  };
}

export interface FinancialMetrics {
  mrr: number;
  mrrGrowth: number;
  arpu: number;
  churnRate: number;
  comparison?: {
    mrr: number;
    churnRate: number;
  };
}

export interface UsageMetrics {
  articles: number;
  socialPosts: number;
  quotaUsage: number;
  comparison?: {
    articles: number;
    socialPosts: number;
  };
}

export interface SystemMetrics {
  jobs: {
    waiting: number;
    failed: number;
    active: number;
    details: {
      articles: JobMetrics;
      socialMedia: JobMetrics;
    };
  };
  avgGenerationTime: number;
}

export interface JobMetrics {
  waiting: number;
  failed: number;
  active: number;
}

export interface Alert {
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  link?: string;
}

export interface ChartData {
  date: string;
  [key: string]: string | number;
}

export interface UserGrowthData extends ChartData {
  users: number;
}

export interface MRREvolutionData extends ChartData {
  mrr: number;
}

export interface UsageTimelineData extends ChartData {
  articles: number;
  socialPosts: number;
}

export type DashboardPeriod = 'today' | '7d' | '30d' | '3m' | '1y'; 