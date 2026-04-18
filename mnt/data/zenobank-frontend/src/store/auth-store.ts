import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthTokens, User } from '@/types/auth';
import type { CustomerProfile, KycDocument } from '@/types/domain';

type AuthState = {
  user: User | null;
  tokens: AuthTokens | null;
  customerProfile: CustomerProfile | null;
  kycDocuments: KycDocument[];
  setSession: (params: { user: User; tokens: AuthTokens }) => void;
  setUser: (user: User | null) => void;
  setCustomerProfile: (profile: CustomerProfile | null) => void;
  setKycDocuments: (documents: KycDocument[]) => void;
  clearSession: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      customerProfile: null,
      kycDocuments: [],
      setSession: ({ user, tokens }) => set({ user, tokens }),
      setUser: (user) => set({ user }),
      setCustomerProfile: (customerProfile) => set({ customerProfile }),
      setKycDocuments: (kycDocuments) => set({ kycDocuments }),
      clearSession: () =>
        set({ user: null, tokens: null, customerProfile: null, kycDocuments: [] }),
    }),
    {
      name: 'zenobank-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        tokens: state.tokens,
        customerProfile: state.customerProfile,
        kycDocuments: state.kycDocuments,
      }),
    },
  ),
);
