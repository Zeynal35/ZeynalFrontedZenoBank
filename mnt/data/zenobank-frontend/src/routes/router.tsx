import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/auth-layout';
import { AppShell } from '@/components/layout/app-shell';
import { AdminGuard, OnboardingGuard, ProtectedRoute, RoleGuard } from '@/routes/guards';
import { RegisterPage } from '@/pages/auth/register-page';
import { LoginPage } from '@/pages/auth/login-page';
import { VerifyEmailPage } from '@/pages/auth/verify-email-page';
import { CustomerOnboardingPage } from '@/pages/customer/customer-onboarding-page';
import { KycUploadPage } from '@/pages/customer/kyc-upload-page';
import { CustomerDashboardPage } from '@/pages/customer/customer-dashboard-page';
import { AccountsPage } from '@/pages/customer/accounts-page';
import { AccountDetailPage } from '@/pages/customer/account-detail-page';
import { TransactionsPage } from '@/pages/customer/transactions-page';
import { TransactionActionPage } from '@/pages/customer/transaction-action-page';
import { LoansPage } from '@/pages/customer/loans-page';
import { NotificationsPage } from '@/pages/customer/notifications-page';
import { ProfilePage } from '@/pages/customer/profile-page';
import { AdminDashboardPage } from '@/pages/admin/admin-dashboard-page';
import { AdminCustomersPage } from '@/pages/admin/admin-customers-page';
import { AdminKycPage } from '@/pages/admin/admin-kyc-page';
import { AdminAccountsPage } from '@/pages/admin/admin-accounts-page';
import { AdminTransactionsPage } from '@/pages/admin/admin-transactions-page';
import { AdminLoansPage } from '@/pages/admin/admin-loans-page';
import { AdminNotificationsPage } from '@/pages/admin/admin-notifications-page';
import { ForbiddenPage, NotFoundPage, UnauthorizedPage } from '@/pages/shared/system-pages';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/auth/login" replace /> },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'register', element: <RegisterPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'verify-email', element: <VerifyEmailPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/app',
        element: <AppShell mode="customer" />,
        children: [
          { path: 'onboarding/customer-profile', element: <CustomerOnboardingPage /> },
          { path: 'onboarding/kyc', element: <KycUploadPage /> },
          {
            element: <OnboardingGuard />,
            children: [
              { path: 'dashboard', element: <CustomerDashboardPage /> },
              { path: 'accounts', element: <AccountsPage /> },
              { path: 'accounts/:id', element: <AccountDetailPage /> },
              { path: 'transactions', element: <TransactionsPage /> },
              { path: 'deposit', element: <TransactionActionPage mode="deposit" /> },
              { path: 'withdraw', element: <TransactionActionPage mode="withdraw" /> },
              { path: 'transfer', element: <TransactionActionPage mode="transfer" /> },
              { path: 'loans', element: <LoansPage /> },
              { path: 'notifications', element: <NotificationsPage /> },
              { path: 'profile', element: <ProfilePage /> },
            ],
          },
        ],
      },
      {
        element: <AdminGuard />,
        children: [
          {
            path: '/admin',
            element: <AppShell mode="admin" />,
            children: [
              { path: 'dashboard', element: <AdminDashboardPage /> },
              { path: 'customers', element: <AdminCustomersPage /> },
              { path: 'kyc', element: <AdminKycPage /> },
              { path: 'accounts', element: <AdminAccountsPage /> },
              { path: 'transactions', element: <AdminTransactionsPage /> },
              { path: 'loans', element: <AdminLoansPage /> },
              { path: 'notifications', element: <AdminNotificationsPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  { path: '/forbidden', element: <ForbiddenPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

