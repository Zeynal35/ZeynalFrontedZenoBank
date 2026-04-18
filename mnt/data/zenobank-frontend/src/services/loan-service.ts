import { api, unwrap } from '@/lib/axios';
import type { Loan } from '@/types/domain';

export const loanService = {
  create: (payload: Record<string, unknown>) => unwrap<Loan>(api.post('/api/loans', payload)),
  getMine: () => unwrap<Loan[]>(api.get('/api/loans/my')),
  getMineById: (id: string) => unwrap<Loan>(api.get(`/api/loans/my/${id}`)),
  getAll: () => unwrap<Loan[]>(api.get('/api/loans')),
  getById: (id: string) => unwrap<Loan>(api.get(`/api/loans/${id}`)),
  approve: (id: string) => unwrap(api.patch(`/api/loans/${id}/approve`)),
  reject: (id: string, reason: string) => unwrap(api.patch(`/api/loans/${id}/reject`, { reason })),
};
