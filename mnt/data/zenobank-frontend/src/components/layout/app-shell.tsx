import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, Building2, CreditCard, LayoutDashboard, Landmark, ShieldCheck, UserCircle2, Users, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AnimatedNeuralBackground } from '@/components/background/animated-neural-background';
import { PageAmbientLighting } from '@/components/background/ambient-layers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

// ✅ Yalnız SuperAdmin və Admin
const ADMIN_ROLES = ['SuperAdmin', 'Admin'];

// JWT token-dən roles oxu (base64 decode)
function getRolesFromToken(token: string): string[] {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // .NET JWT-də roles claim adları müxtəlif ola bilər
    const roles =
      payload['role'] ??
      payload['roles'] ??
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      [];
    return Array.isArray(roles) ? roles : [roles];
  } catch {
    return [];
  }
}

const adminLoginSchema = z.object({
  email: z.string().email('Düzgün email daxil edin'),
  password: z.string().min(1, 'Şifrə tələb olunur'),
});
type AdminLoginForm = z.infer<typeof adminLoginSchema>;

function AdminLoginModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (result) => {
      // ✅ Həm user.roles həm də JWT token-dən yoxla
      const rolesFromUser = result.user.roles ?? [];
      const rolesFromToken = getRolesFromToken(result.tokens.accessToken);
      const allRoles = [...new Set([...rolesFromUser, ...rolesFromToken])];

      const hasAccess = allRoles.some((r) => ADMIN_ROLES.includes(r));

      if (!hasAccess) {
        toast.error('Giriş qadağandır. Yalnız SuperAdmin və Admin daxil ola bilər.');
        return;
      }

      // User-i roles ilə birlikdə yenilə
      const updatedUser = {
        ...result.user,
        roles: allRoles as typeof result.user.roles,
      };

      setSession({ user: updatedUser, tokens: result.tokens });
      toast.success('Admin panelə xoş gəldiniz!');
      onClose();
      navigate('/admin/dashboard', { replace: true });
    },
    onError: () => {
      toast.error('Email və ya şifrə yanlışdır.');
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/10 bg-slate-900/95 p-8 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:text-white transition">
          <X className="h-5 w-5" />
        </button>
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80 mb-2">Admin Girişi</p>
        <h2 className="text-2xl font-semibold text-white">ZenoBank Control Center</h2>
        <p className="mt-2 text-sm text-slate-400">SuperAdmin və ya Admin hesabınızla daxil olun.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit((v) => mutation.mutate(v))}>
          <label className="block text-sm">
            <span className="mb-2 block text-slate-300">Email</span>
            <Input type="email" autoComplete="off" placeholder="admin@zenobank.local" {...register('email')} />
            {errors.email && <span className="mt-1 block text-xs text-red-400">{errors.email.message}</span>}
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-slate-300">Şifrə</span>
            <Input type="password" autoComplete="new-password" placeholder="••••••••" {...register('password')} />
            {errors.password && <span className="mt-1 block text-xs text-red-400">{errors.password.message}</span>}
          </label>
          <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
            {mutation.isPending ? 'Giriş edilir...' : 'Admin Panelə Giriş'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AppShell({ mode }: { mode: 'customer' | 'admin' }) {
  useBootstrap();
  const navigate = useNavigate();
  const { user, tokens, clearSession } = useAuthStore();
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // ✅ Həm store-dakı roles həm token-dən yoxla
  const rolesFromStore = user?.roles ?? [];
  const rolesFromToken = tokens?.accessToken ? getRolesFromToken(tokens.accessToken) : [];
  const allRoles = [...new Set([...rolesFromStore, ...rolesFromToken])];
  const isAdmin = allRoles.some((r) => ADMIN_ROLES.includes(r));

  const navItems = mode === 'admin' ? adminNav : customerNav;

  const handleLogout = async () => {
    try { await authService.logout(); } finally {
      clearSession();
      window.location.href = '/auth/login';
    }
  };

  const handleAvatarClick = () => {
    if (mode === 'admin') {
      // ✅ Admin → Customer: store-u tamamilə təmizlə, login-ə göndər
      // Köhnə customer session qalmır, yeni customer login olur
      clearSession();
      window.location.href = '/auth/login';
    } else if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setAdminModalOpen(true);
    }
  };

  const userInitial = (user?.fullName ?? 'U').slice(0, 1).toUpperCase();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedNeuralBackground />
      <PageAmbientLighting />

      {adminModalOpen && <AdminLoginModal onClose={() => setAdminModalOpen(false)} />}

      <div className="relative z-10 flex min-h-screen">
        <aside className="glass-panel-strong hidden w-80 flex-col border-r border-white/10 p-5 lg:flex">
          <ZenoBankLogo className="mb-10" />
          <nav className="space-y-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => cn('flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition',
                  isActive ? 'bg-sky-500/12 text-white shadow-glow' : 'text-slate-400 hover:bg-white/[0.03] hover:text-slate-100')}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-4">
            <button onClick={handleAvatarClick}
              className="flex w-full items-center gap-3 rounded-2xl border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm text-sky-100 hover:bg-sky-500/20 transition">
              <div className="h-3 w-3 rounded-full bg-sky-300" />
              {mode === 'admin' ? 'Switch to Customer App' : 'Open Admin Panel'}
            </button>
            <Button variant="secondary" onClick={handleLogout} className="w-full">Sign out</Button>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/40 backdrop-blur-xl">
            <div className="page-shell flex items-center justify-between py-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">
                  {mode === 'admin' ? 'Control Center' : 'Customer Workspace'}
                </p>
                <h2 className="mt-1 text-lg font-medium text-white">
                  Welcome back, {user?.fullName ?? 'User'}
                </h2>
              </div>
              <button onClick={handleAvatarClick}
                title={mode === 'admin' ? 'Switch to Customer App' : 'Open Admin Panel'}
                className="grid h-11 w-11 place-items-center rounded-full border border-sky-400/20 bg-gradient-to-br from-sky-500/20 to-blue-500/10 text-sky-100 hover:ring-2 hover:ring-sky-400/40 transition cursor-pointer">
                {userInitial}
              </button>
            </div>
          </header>
          <main className="page-shell flex-1 py-6"><Outlet /></main>
        </div>
      </div>
    </div>
  );
}

