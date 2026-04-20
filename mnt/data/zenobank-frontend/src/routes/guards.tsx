import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

const ADMIN_ROLES = ['SuperAdmin', 'Admin', 'Operator'];

export function ProtectedRoute() {
  const { tokens } = useAuthStore();
  const location = useLocation();
  if (!tokens?.accessToken)
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export function AdminGuard() {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!user.roles.some((role) => ADMIN_ROLES.includes(role)))
    return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}

export function RoleGuard({ roles }: { roles: string[] }) {
  const user = useAuthStore((state) => state.user);
  if (!user) return <Navigate to="/auth/login" replace />;
  if (!user.roles.some((role) => roles.includes(role)))
    return <Navigate to="/forbidden" replace />;
  return <Outlet />;
}

export function OnboardingGuard() {
  const { customerProfile } = useAuthStore();
  if (!customerProfile)
    return <Navigate to="/app/onboarding/customer-profile" replace />;
  return <Outlet />;
}

