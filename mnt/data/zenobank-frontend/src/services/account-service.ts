import { api, unwrap } from '@/lib/axios';
import type { Account } from '@/types/domain';
 
// ✅ Backend enum: Current=1, Savings=2
const ACCOUNT_TYPE_MAP: Record<string, number> = {
  Current: 1,
  Savings: 2,
};
 
export type CreateAccountPayload = {
  customerProfileId: string;
  accountType: 'Current' | 'Savings';
  currency: string;
};
 
export const accountService = {
  // ✅ Backend: { CustomerProfileId, AccountType (int), Currency }
  create: (payload: CreateAccountPayload) =>
    unwrap<Account>(
      api.post('/api/accounts', {
        customerProfileId: payload.customerProfileId,
        accountType: ACCOUNT_TYPE_MAP[payload.accountType] ?? 1,
        currency: payload.currency,
      }),
    ),
 
  getMine: () => unwrap<Account[]>(api.get('/api/accounts/my')),
  getMineById: (id: string) => unwrap<Account>(api.get(`/api/accounts/my/${id}`)),
  getBalance: (id: string) => unwrap<number>(api.get(`/api/accounts/my/${id}/balance`)),
  getAll: () => unwrap<Account[]>(api.get('/api/accounts')),
  getById: (id: string) => unwrap<Account>(api.get(`/api/accounts/${id}`)),
  freeze: (id: string) => unwrap(api.patch(`/api/accounts/${id}/freeze`)),
  unfreeze: (id: string) => unwrap(api.patch(`/api/accounts/${id}/unfreeze`)),
};
