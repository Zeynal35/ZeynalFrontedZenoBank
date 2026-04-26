import { api, unwrap } from '@/lib/axios';
import type { DashboardAnalytics } from '@/types/analytics';

export const analyticsService = {
  getMine: () => unwrap<DashboardAnalytics>(api.get('/api/transactions/my/analytics')),
  getAll:  () => unwrap<DashboardAnalytics>(api.get('/api/transactions/analytics')),
};