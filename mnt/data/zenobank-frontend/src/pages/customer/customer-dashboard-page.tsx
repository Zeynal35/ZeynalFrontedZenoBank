import type { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell, BriefcaseBusiness, CreditCard, ShieldCheck } from 'lucide-react';
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

// Analytics chart komponentləri
import { AnalyticsSummaryCards } from '@/components/charts/analytics-summary-cards';
import { CashFlowChart } from '@/components/charts/cash-flow-chart';
import { MonthlyVolumeChart } from '@/components/charts/monthly-volume-chart';
import { TransactionTypeChart } from '@/components/charts/transaction-type-chart';

// Yeni widgetlər
import { WorldClockWidget } from '@/components/widgets/world-clock-widget';
import { ExchangeRatesWidget } from '@/components/widgets/exchange-rates-widget';
import { WeatherWidget } from '@/components/widgets/weather-widget';

export function CustomerDashboardPage() {
  const customerProfile = useAuthStore((state) => state.customerProfile);
  const kycDocuments    = useAuthStore((state) => state.kycDocuments);

  const accounts      = useQuery({ queryKey: ['accounts'],      queryFn: accountService.getMine });
  const transactions  = useQuery({ queryKey: ['transactions'],  queryFn: transactionService.getMine });
  const loans         = useQuery({ queryKey: ['loans'],         queryFn: loanService.getMine });
  const notifications = useQuery({ queryKey: ['notifications'], queryFn: notificationService.getMine });

  const totalBalance = (accounts.data ?? []).reduce((sum, a) => sum + a.balance, 0);
  const unreadCount  = (notifications.data ?? []).filter((n) => !n.isRead).length;
  const kycStatus    = kycDocuments[0]?.status ?? 'Pending';

  return (
    <div className="space-y-8">

      {/* ── Başlıq ── */}
      <SectionHeader
        eyebrow="Customer dashboard"
        title="Banking overview"
        description="Monitor balances, KYC state, recent money movement, and account growth."
        actions={<Button asChild><Link to="/app/accounts">Hesabları idarə et</Link></Button>}
      />

      {/* ── Əsas stat kartlar ── */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Ümumi balans"        value={currency(totalBalance)}                                                                          subtitle="Bütün aktiv hesablar"          icon={CreditCard}       />
        <StatCard title="Hesab sayı"          value={String(accounts.data?.length ?? 0)}                                                              subtitle="Çoxlu hesab bankçılığı"        icon={BriefcaseBusiness}/>
        <StatCard title="Aktiv kreditlər"     value={String((loans.data ?? []).filter((l) => l.status === 'Approved').length)}                        subtitle="Təsdiqlənmiş kredit xətləri"  icon={ShieldCheck}      />
        <StatCard title="Oxunmamış bildiriş"  value={String(unreadCount)}                                                                             subtitle="Təhlükəsizlik xəbərdarlıqları" icon={Bell}             />
      </div>

      {/* ── Dünya Saatı ── */}
      <WorldClockWidget />

      {/* ── Hava + Valyuta ── */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <WeatherWidget />
        <ExchangeRatesWidget />
      </div>

      {/* ── Analytics xülasə kartlar ── */}
      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-400">Bu Ayın Analitikası</h2>
        <AnalyticsSummaryCards />
      </div>

      {/* ── Cash Flow + Donut ── */}
      <div>
        <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-slate-400">Maliyyə Hərəkəti</h2>
        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
          <CashFlowChart />
          <TransactionTypeChart />
        </div>
      </div>

      {/* ── Aylıq Həcm + KYC ── */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <MonthlyVolumeChart />
        <Card className="rounded-[28px]">
          <h3 className="text-lg font-semibold text-white">Doğrulama vəziyyəti</h3>
          <div className="mt-4 space-y-4">
            <Row label="Müştəri statusu" value={<StatusBadge value={customerProfile?.status ?? 'Pending'} />} />
            <Row label="KYC statusu"     value={<StatusBadge value={kycStatus} />} />
            <Row label="Risk səviyyəsi"  value={<StatusBadge value={customerProfile?.riskLevel ?? 'Low'} />} />
            <Row label="Qara siyahı"     value={<span className="text-sm text-slate-300">{customerProfile?.blacklisted ? 'Bəli' : 'Xeyr'}</span>} />
          </div>
        </Card>
      </div>

      {/* ── Son tranzaksiyalar + Quick actions ── */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[28px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Son tranzaksiyalar</h3>
            <Button variant="ghost" asChild><Link to="/app/transactions">Hamısı</Link></Button>
          </div>
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
            {(transactions.data ?? []).length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">Hələ tranzaksiya yoxdur</p>
            )}
          </div>
        </Card>

        <Card className="rounded-[28px]">
          <h3 className="mb-4 text-lg font-semibold text-white">Sürətli əməliyyatlar</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button asChild><Link to="/app/deposit">Depozit qoy</Link></Button>
            <Button variant="secondary" asChild><Link to="/app/withdraw">Pul çıxar</Link></Button>
            <Button variant="secondary" asChild><Link to="/app/transfer">Köçürmə et</Link></Button>
            <Button variant="secondary" asChild><Link to="/app/loans">Kredit al</Link></Button>
          </div>
        </Card>
      </div>

    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
      <span className="text-sm text-slate-400">{label}</span>
      {value}
    </div>
  );
}