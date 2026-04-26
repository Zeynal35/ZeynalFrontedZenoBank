export type AuditLog = {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  status: 'Success' | 'Failed' | string;
  createdAtUtc: string;
};

export type AuditLogPage = {
  items: AuditLog[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type AuditLogFilter = {
  userId?: string;
  entityType?: string;
  action?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  pageSize: number;
};