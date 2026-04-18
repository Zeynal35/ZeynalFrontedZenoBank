import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CreditCard, ShieldCheck, Users } from 'lucide-react';
import { SectionHeader } from '@/components/ui/section-header';
import { StatCard } from '@/components/ui/stat-card';
import { Card } from '@/components/ui/card';
import { customerService } from '@/services/customer-service';
import { accountService } from '@/services/account-service';
import { loanService } from '@/services/loan-service';

export function AdminDashboardPage() {
  const customers = useQuery({ queryKey: ['admin-customers'], queryFn: customerService.getAll });
  const kyc = useQuery({ queryKey: ['admin-kyc'], queryFn: customerService.getAllKyc });
  const loans = useQuery({ queryKey: ['admin-loans'], queryFn: loanService.getAll });
  const accounts = useQuery({ queryKey: ['admin-accounts'], queryFn: accountService.getAll });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Admin overview" title="Compliance and operations dashboard" description="Monitor approval queues, customer risk, frozen assets, and recent platform activity from one enterprise-grade command surface." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total customers" value={String(customers.data?.length ?? 0)} icon={Users} />
        <StatCard title="Pending KYC" value={String((kyc.data ?? []).filter((item) => item.status === 'Pending').length)} icon={ShieldCheck} />
        <StatCard title="Pending loans" value={String((loans.data ?? []).filter((item) => item.status === 'Pending').length)} icon={AlertTriangle} />
        <StatCard title="Frozen accounts" value={String((accounts.data ?? []).filter((item) => item.status === 'Frozen').length)} icon={CreditCard} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-[28px]"><h3 className="text-lg font-semibold text-white">Risk overview</h3><p className="mt-3 text-sm text-slate-400">High-risk customers, blacklist actions, KYC exceptions, and manual review triggers can be monitored and escalated from the management modules.</p></Card>
        <Card className="rounded-[28px]"><h3 className="text-lg font-semibold text-white">Recent activity</h3><p className="mt-3 text-sm text-slate-400">Loan approvals, account freezes, customer status changes, and security notifications flow through the admin tools built into this frontend.</p></Card>
      </div>
    </div>
  );
}
