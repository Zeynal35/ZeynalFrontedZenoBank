import { NavLink, Outlet } from 'react-router-dom';
import { Bell, Building2, CreditCard, LayoutDashboard, Landmark, ShieldCheck, UserCircle2, Users } from 'lucide-react';
import { AnimatedNeuralBackground } from '@/components/background/animated-neural-background';
import { PageAmbientLighting } from '@/components/background/ambient-layers';
import { Button } from '@/components/ui/button';
import { ZenoBankLogo } from '@/components/layout/logo';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth-service';
import { useBootstrap } from '@/hooks/use-bootstrap';

const customerNav = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/accounts', label: 'Accounts', icon: CreditCard },
  { to: '/app/transactions', label: 'Transactions', icon: Landmark },
  { to: '/app/deposit', label: 'Deposit', icon: Building2 },
  { to: '/app/withdraw', label: 'Withdraw', icon: Building2 },
  { to: '/app/transfer', label: 'Transfer', icon: Building2 },
  { to: '/app/loans', label: 'Loans', icon: ShieldCheck },
  { to: '/app/notifications', label: 'Notifications', icon: Bell },
  { to: '/app/profile', label: 'Profile', icon: UserCircle2 },
];

const adminNav = [
  { to: '/admin/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/kyc', label: 'KYC Management', icon: ShieldCheck },
  { to: '/admin/accounts', label: 'Accounts', icon: CreditCard },
  { to: '/admin/transactions', label: 'Transactions', icon: Landmark },
  { to: '/admin/loans', label: 'Loans', icon: Building2 },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
];

export function AppShell({ mode }: { mode: 'customer' | 'admin' }) {
  useBootstrap();
  const { user, clearSession } = useAuthStore();
  const canAccessAdmin = user?.roles.some((role) => ['Admin', 'SuperAdmin', 'Operator'].includes(role));
  const navItems = mode === 'admin' ? adminNav : customerNav;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
      window.location.href = '/auth/login';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedNeuralBackground />
      <PageAmbientLighting />
      <div className="relative z-10 flex min-h-screen">
        <aside className="glass-panel-strong hidden w-80 flex-col border-r border-white/10 p-5 lg:flex">
          <ZenoBankLogo className="mb-10" />
          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition', isActive ? 'bg-sky-500/12 text-white shadow-glow' : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-100')}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-4">
            {canAccessAdmin ? (
              <NavLink to={mode === 'admin' ? '/app/dashboard' : '/admin/dashboard'} className="flex items-center gap-3 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100">
                <div className="h-3 w-3 rounded-full bg-sky-300" />
                {mode === 'admin' ? 'Switch to customer app' : 'Open admin panel'}
              </NavLink>
            ) : null}
            <Button variant="secondary" onClick={handleLogout} className="w-full">Sign out</Button>
          </div>
        </aside>
        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
            <div className="page-shell flex items-center justify-between py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">{mode === 'admin' ? 'Control Center' : 'Customer Workspace'}</p>
                <h2 className="mt-1 text-lg font-medium text-white">Welcome back, {user?.fullName ?? 'User'}</h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full border border-sky-400/20 bg-gradient-to-br from-sky-500/20 to-blue-500/10 text-sky-100">
                  {(user?.roles?.[0] ?? 'C').slice(0, 1)}
                </div>
              </div>
            </div>
          </header>
          <main className="page-shell flex-1 py-6"><Outlet /></main>
        </div>
      </div>
    </div>
  );
}
