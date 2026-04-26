import { api, unwrap } from '@/lib/axios';
import type { AuditLogFilter, AuditLogPage } from '@/types/audit-log';

function buildParams(filter: AuditLogFilter) {
  const p = new URLSearchParams();
  p.set('page', String(filter.page));
  p.set('pageSize', String(filter.pageSize));
  if (filter.userId)     p.set('userId',     filter.userId);
  if (filter.entityType) p.set('entityType', filter.entityType);
  if (filter.action)     p.set('action',     filter.action);
  if (filter.status)     p.set('status',     filter.status);
  if (filter.fromDate)   p.set('fromDate',   filter.fromDate);
  if (filter.toDate)     p.set('toDate',     filter.toDate);
  return p.toString();
}

export const auditLogService = {
  getPaged: (filter: AuditLogFilter) =>
    unwrap<AuditLogPage>(api.get(`/api/audit-logs?${buildParams(filter)}`)),

  getEntityTypes: () =>
    unwrap<string[]>(api.get('/api/audit-logs/entity-types')),

  getActions: () =>
    unwrap<string[]>(api.get('/api/audit-logs/actions')),
};