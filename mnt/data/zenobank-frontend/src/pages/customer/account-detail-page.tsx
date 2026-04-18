import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { accountService } from '@/services/account-service';
import { transactionService } from '@/services/transaction-service';
import { currency, dateTime } from '@/lib/utils';

export function AccountDetailPage() {
  const { id = '' } = useParams();
  const account = useQuery({ queryKey: ['account', id], queryFn: () => accountService.getMineById(id), enabled: !!id });
  const transactions = useQuery({ queryKey: ['transactions'], queryFn: transactionService.getMine });
  const relatedTransactions = (transactions.data ?? []).filter((item) => item.accountId === id).slice(0, 6);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Account details" title={account.data?.accountName ?? 'Account'} description="Review account state, balance integrity, and recent activity from a secure account-level command view." actions={<div className="flex gap-3"><Button variant="secondary" asChild><Link to="/app/deposit">Deposit</Link></Button><Button asChild><Link to="/app/transfer">Transfer</Link></Button></div>} />
      <Card className="rounded-[32px] bg-gradient-to-br from-blue-950/60 to-slate-950/60 p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-slate-400">Account number</p>
            <h2 className="mt-2 text-4xl font-semibold text-white">{account.data?.accountNumber}</h2>
            <p className="mt-4 text-sm text-slate-400">Type: {account.data?.accountType}</p>
          </div>
          <div className="text-right">
            <StatusBadge value={account.data?.status ?? 'Pending'} />
            <p className="mt-5 text-sm text-slate-400">Available balance</p>
            <p className="mt-2 text-4xl font-semibold text-white">{currency(account.data?.balance ?? 0, account.data?.currency ?? 'USD')}</p>
          </div>
        </div>
      </Card>
      <Card className="rounded-[28px]">
        <h3 className="text-lg font-semibold text-white">Recent account activity</h3>
        <div className="mt-4 space-y-3">
          {relatedTransactions.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
              <div><p className="font-medium text-white">{item.type}</p><p className="text-sm text-slate-400">{dateTime(item.createdAt)}</p></div>
              <p className="font-medium text-white">{currency(item.amount, item.currency)}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
