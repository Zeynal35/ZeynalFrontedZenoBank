import { api, unwrap } from '@/lib/axios';

export type CustomerProfilePayload = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
};

export type CustomerProfile = {
  id?: string;
  userId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  address: string;
  status?: string;
  riskLevel?: string;
  isBlacklisted?: boolean;
  blacklistReason?: string | null;
  age?: number;
};

export const customerService = {
  createMe: (payload: CustomerProfilePayload) =>
    unwrap<CustomerProfile>(api.post('/api/customers/me', payload)),

  getMe: () =>
    unwrap<CustomerProfile>(api.get('/api/customers/me')),

  updateMe: (payload: CustomerProfilePayload) =>
    unwrap<CustomerProfile>(api.put('/api/customers/me', payload)),
};