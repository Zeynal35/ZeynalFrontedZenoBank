import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { accountService } from '@/services/account-service';
import { currency, dateTime } from '@/lib/utils';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';

export function AccountsPage() {
  const query = useQuery({ queryKey: ['accounts'], queryFn: accountService.getMine });
  const [open, setOpen] = useState(false);
  const form = useForm<{ accountName: string; accountType: 'Savings' | 'Current'; currency: string }>({ defaultValues: { accountName: '', accountType: 'Savings', currency: 'USD' } });
  const createMutation = useMutation({
    mutationFn: (values: { accountName: string; accountType: 'Savings' | 'Current'; currency: string }) => accountService.create(values),
    onSuccess: async () => {
      await query.refetch();
      setOpen(false);
      form.reset();
    },
  });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Accounts" title="Your account portfolio" description="Create multiple bank accounts once onboarding is complete, then monitor status, balance, and lifecycle from one premium workspace." actions={<Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Create account</Button>} />
      <div className="grid gap-5 xl:grid-cols-2">
        {(query.data ?? []).map((account) => (
          <Link key={account.id} to={`/app/accounts/${account.id}`}>
            <Card className="rounded-[28px] transition hover:-translate-y-1 hover:border-sky-400/20 hover:bg-white/[0.05]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{account.accountType} account</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{account.accountName}</h3>
                  <p className="mt-2 text-sm text-slate-500">{account.accountNumber}</p>
                </div>
                <StatusBadge value={account.status} />
              </div>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-400">Available balance</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{currency(account.balance, account.currency)}</p>
                </div>
                <p className="text-xs text-slate-500">Opened {dateTime(account.createdAt)}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      <Modal open={open} onOpenChange={setOpen} title="Create a new account">
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}>
          <Field label="Account name"><Input {...form.register('accountName')} placeholder="Primary Treasury" /></Field>
          <Field label="Account type"><Select value={form.watch('accountType')} onValueChange={(value) => form.setValue('accountType', value as 'Savings' | 'Current')} placeholder="Choose account type" options={[{ label: 'Savings', value: 'Savings' }, { label: 'Current', value: 'Current' }]} /></Field>
          <Field label="Currency"><Input {...form.register('currency')} placeholder="USD" /></Field>
          <div className="flex justify-end"><Button type="submit">Create account</Button></div>
        </form>
      </Modal>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="mb-2 block text-sm text-slate-300">{label}</span>{children}</label>; }
