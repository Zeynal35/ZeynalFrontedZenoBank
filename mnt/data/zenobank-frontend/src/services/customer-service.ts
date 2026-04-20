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
  profileCompleted?: boolean;
};
 
export type KycDocument = {
  id: string;
  userId: string;
  customerProfileId: string;
  documentType: string;
  documentNumber: string;
  originalFileName: string;
  filePath: string;
  status: string; // 'Pending' | 'Approved' | 'Rejected'
  reviewerNote?: string | null;
  reviewedByUserId?: string | null;
  reviewedAtUtc?: string | null;
  createdAtUtc: string;
  // alias fields
  fileName?: string;
  createdAt?: string;
};
 
export const customerService = {
  // ── Customer Profile ───────────────────────────────────
  createMe: (payload: CustomerProfilePayload) =>
    unwrap<CustomerProfile>(api.post('/api/customers/me', payload)),
 
  getMe: () =>
    unwrap<CustomerProfile>(api.get('/api/customers/me')),
 
  updateMe: (payload: CustomerProfilePayload) =>
    unwrap<CustomerProfile>(api.put('/api/customers/me', payload)),
 
  // ── KYC Documents ──────────────────────────────────────
  // GET /api/customers/kyc/my
  getMyKyc: () =>
    unwrap<KycDocument[]>(api.get('/api/customers/kyc/my')),
 
  // POST /api/customers/kyc/upload  (multipart/form-data)
  uploadKyc: (formData: FormData) =>
    unwrap<KycDocument>(
      api.post('/api/customers/kyc/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    ),
 
  // GET /api/customers/kyc  (Admin only)
  getAllKyc: () =>
    unwrap<KycDocument[]>(api.get('/api/customers/kyc')),
 
  // PATCH /api/customers/kyc/{id}/approve  — body: { reviewerNote }
  approveKyc: (id: string, reviewerNote: string) =>
    unwrap<KycDocument>(
      api.patch(`/api/customers/kyc/${id}/approve`, { reviewerNote }),
    ),
 
  // PATCH /api/customers/kyc/{id}/reject  — body: { reviewerNote }
  rejectKyc: (id: string, reviewerNote: string) =>
    unwrap<KycDocument>(
      api.patch(`/api/customers/kyc/${id}/reject`, { reviewerNote }),
    ),
};