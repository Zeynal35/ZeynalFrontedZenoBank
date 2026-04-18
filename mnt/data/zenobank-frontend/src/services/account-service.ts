import { api, unwrap } from '@/lib/axios';
import type { Account } from '@/types/domain';

export const accountService = {
  create: (payload: Partial<Account>) => unwrap<Account>(api.post('/api/accounts', payload)),
  getMine: () => unwrap<Account[]>(api.get('/api/accounts/my')),
  getMineById: (id: string) => unwrap<Account>(api.get(`/api/accounts/my/${id}`)),
  getBalance: (id: string) => unwrap<number>(api.get(`/api/accounts/my/${id}/balance`)),
  getAll: () => unwrap<Account[]>(api.get('/api/accounts')),
  getById: (id: string) => unwrap<Account>(api.get(`/api/accounts/${id}`)),
  freeze: (id: string) => unwrap(api.patch(`/api/accounts/${id}/freeze`)),
  unfreeze: (id: string) => unwrap(api.patch(`/api/accounts/${id}/unfreeze`)),
};
