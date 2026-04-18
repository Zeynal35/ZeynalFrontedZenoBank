import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

export function ProtectedRoute() {
  const { tokens } = useAuthStore();
  const location = useLocation();
  if (!tokens?.accessToken) return <Navigate to="/auth/register" replace state={{ from: location }} />;
  return <Outlet />;
}

export function RoleGuard({ roles }: { roles: string[] }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!user.roles.some((role) => roles.includes(role))) return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}

export function OnboardingGuard() {
  const { customerProfile } = useAuthStore();
  if (!customerProfile?.profileCompleted) return <Navigate to="/app/onboarding/customer-profile" replace />;
  return <Outlet />;
}
