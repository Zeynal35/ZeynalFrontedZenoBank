import { api, unwrap } from '@/lib/axios';
import type { Loan } from '@/types/domain';
 
export type CreateLoanPayload = {
  customerProfileId: string;
  disbursementAccountId: string;
  principalAmount: number;
  termInMonths: number;
  currency: string;
  purpose: string;
};
 
export const loanService = {
  // POST /api/loans — { customerProfileId, disbursementAccountId, principalAmount, termInMonths, currency, purpose }
  create: (payload: CreateLoanPayload) =>
    unwrap<Loan>(api.post('/api/loans', payload)),
 
  getMine: () =>
    unwrap<Loan[]>(api.get('/api/loans/my')),
 
  getMineById: (id: string) =>
    unwrap<Loan>(api.get(`/api/loans/my/${id}`)),
 
  getAll: () =>
    unwrap<Loan[]>(api.get('/api/loans')),
 
  getById: (id: string) =>
    unwrap<Loan>(api.get(`/api/loans/${id}`)),
 
  // PATCH /api/loans/{id}/approve — { interestRate: decimal }
  approve: (id: string, interestRate: number) =>
    unwrap(api.patch(`/api/loans/${id}/approve`, { interestRate })),
 
  // PATCH /api/loans/{id}/reject — { reason: string }
  reject: (id: string, reason: string) =>
    unwrap(api.patch(`/api/loans/${id}/reject`, { reason })),
};