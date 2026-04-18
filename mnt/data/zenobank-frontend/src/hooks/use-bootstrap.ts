import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { authService } from '@/services/auth-service';
import { customerService } from '@/services/customer-service';

export function useBootstrap() {
  const { tokens, setUser, setCustomerProfile, setKycDocuments, clearSession } = useAuthStore();

  useEffect(() => {
    async function bootstrap() {
      if (!tokens?.accessToken) return;
      try {
        const user = await authService.me();
        setUser(user);
        try {
          const [profile, documents] = await Promise.all([customerService.getMe(), customerService.getMyKyc()]);
          setCustomerProfile(profile);
          setKycDocuments(documents);
        } catch {
          setCustomerProfile(null);
        }
      } catch {
        clearSession();
      }
    }
    bootstrap();
  }, [tokens?.accessToken, setUser, setCustomerProfile, setKycDocuments, clearSession]);
}
