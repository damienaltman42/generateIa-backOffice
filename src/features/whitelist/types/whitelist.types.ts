export interface WhitelistEntry {
  id: string;
  email: string;
  source: string;
  isConfirmed: boolean;
  createdAt: string;
  updatedAt: string;
  migratedAt?: string;
  migratedUserId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface WhitelistStats {
  total: number;
  confirmed: number;
  migrated: number;
  eligible: number;
  pending: number;
  confirmationRate: number;
  migrationRate: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface WhitelistListResponse {
  data: WhitelistEntry[];
  meta: PaginationMeta;
}

export interface WhitelistQueryParams {
  page?: number;
  limit?: number;
  confirmed?: boolean;
  migrated?: boolean;
  search?: string;
  sortBy?: 'email' | 'createdAt' | 'updatedAt' | 'migratedAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface MigrateUserRequest {
  whitelistId: string;
  reason: string;
}

export interface MigrateUserResponse {
  success: boolean;
  message: string;
  whitelistId?: string;
  userId?: string;
  details?: {
    email?: string;
    migrationDate?: string;
    reason?: string;
    [key: string]: unknown;
  };
}

export interface MigrateBatchRequest {
  whitelistIds: string[];
  reason: string;
}

export interface MigrateBatchResponse {
  totalProcessed: number;
  successful: number;
  failed: number;
  results: Array<{
    success: boolean;
    userId?: string;
    error?: string;
    whitelistEntry: WhitelistEntry;
  }>;
} 