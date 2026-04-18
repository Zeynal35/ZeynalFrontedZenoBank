import { api, unwrap } from '@/lib/axios';
import type { Transaction } from '@/types/domain';

export const transactionService = {
  deposit: (payload: Record<string, unknown>) => unwrap(api.post('/api/transactions/deposit', payload)),
  withdraw: (payload: Record<string, unknown>) => unwrap(api.post('/api/transactions/withdraw', payload)),
  transfer: (payload: Record<string, unknown>) => unwrap(api.post('/api/transactions/transfer', payload)),
  getMine: () => unwrap<Transaction[]>(api.get('/api/transactions/my')),
  getMineById: (id: string) => unwrap<Transaction>(api.get(`/api/transactions/my/${id}`)),
  getAll: () => unwrap<Transaction[]>(api.get('/api/transactions')),
  getById: (id: string) => unwrap<Transaction>(api.get(`/api/transactions/${id}`)),
};
