import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, BriefcaseBusiness, CreditCard, ShieldCheck } from 'lucide-react';
import { BalanceTrendChart } from '@/components/charts/balance-trend-chart';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { accountService } from '@/services/account-service';
import { loanService } from '@/services/loan-service';
import { notificationService } from '@/services/notification-service';
import { transactionService } from '@/services/transaction-service';
import { useAuthStore } from '@/store/auth-store';
import { currency, dateTime } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function CustomerDashboardPage() {
  const customerProfile = useAuthStore((state) => state.customerProfile);
  const kycDocuments = useAuthStore((state) => state.kycDocuments);
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: accountService.getMine });
  const transactions = useQuery({ queryKey: ['transactions'], queryFn: transactionService.getMine });
  const loans = useQuery({ queryKey: ['loans'], queryFn: loanService.getMine });
  const notifications = useQuery({ queryKey: ['notifications'], queryFn: notificationService.getMine });

  const totalBalance = (accounts.data ?? []).reduce((sum, account) => sum + account.balance, 0);
  const unreadCount = (notifications.data ?? []).filter((item) => !item.isRead).length;
  const kycStatus = kycDocuments[0]?.status ?? 'Pending';

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Customer dashboard"
        title="Banking overview"
        description="Monitor balances, KYC state, recent money movement, and account growth from a premium command surface."
        actions={<Button asChild><Link to="/app/accounts">Create or manage accounts</Link></Button>}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total balance" value={currency(totalBalance)} subtitle="Across all active accounts" icon={CreditCard} />
        <StatCard title="Account count" value={String(accounts.data?.length ?? 0)} subtitle="Multi-account banking enabled" icon={BriefcaseBusiness} />
        <StatCard title="Active loans" value={String((loans.data ?? []).filter((loan) => loan.status === 'Approved').length)} subtitle="Pending and approved credit lines" icon={ShieldCheck} />
        <StatCard title="Unread notifications" value={String(unreadCount)} subtitle="Security and banking alerts" icon={Bell} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <BalanceTrendChart />
        <Card className="rounded-[28px]">
          <h3 className="text-lg font-semibold text-white">Verification state</h3>
          <div className="mt-4 space-y-4">
            <Row label="Customer status" value={<StatusBadge value={customerProfile?.status ?? 'Pending'} />} />
            <Row label="KYC status" value={<StatusBadge value={kycStatus} />} />
            <Row label="Risk level" value={<StatusBadge value={customerProfile?.riskLevel ?? 'Low'} />} />
            <Row label="Blacklist" value={<span className="text-sm text-slate-300">{customerProfile?.blacklisted ? 'Yes' : 'No'}</span>} />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[28px]">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-white">Recent transactions</h3><Button variant="ghost" asChild><Link to="/app/transactions">View all</Link></Button></div>
          <div className="space-y-3">
            {(transactions.data ?? []).slice(0, 5).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                <div>
                  <p className="font-medium text-white">{item.description || item.type}</p>
                  <p className="text-sm text-slate-400">{dateTime(item.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{currency(item.amount, item.currency)}</p>
                  <StatusBadge value={item.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card className="rounded-[28px]">
          <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold text-white">Quick actions</h3></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild><Link to="/app/deposit">Deposit funds</Link></Button>
            <Button variant="secondary" asChild><Link to="/app/withdraw">Withdraw funds</Link></Button>
            <Button variant="secondary" asChild><Link to="/app/transfer">Transfer funds</Link></Button>
            <Button variant="secondary" asChild><Link to="/app/loans">Apply for loan</Link></Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"><span className="text-sm text-slate-400">{label}</span>{value}</div>;
}
