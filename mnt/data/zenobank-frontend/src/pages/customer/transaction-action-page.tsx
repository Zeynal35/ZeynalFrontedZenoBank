import type { ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/ui/section-header';
import { accountService } from '@/services/account-service';
import { transactionService } from '@/services/transaction-service';

export function TransactionActionPage({ mode }: { mode: 'deposit' | 'withdraw' | 'transfer' }) {
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: accountService.getMine });
  const form = useForm({ defaultValues: { accountId: '', amount: '', description: '', destinationAccountNumber: '' } });

  const mutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => {
      if (mode === 'deposit') return transactionService.deposit(values);
      if (mode === 'withdraw') return transactionService.withdraw(values);
      return transactionService.transfer(values);
    },
  });

  const titleMap = { deposit: 'Deposit funds', withdraw: 'Withdraw funds', transfer: 'Transfer funds' };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Secure transaction" title={titleMap[mode]} description="Execute controlled movement with clear account selection, validation, and secure UX cues tailored for regulated banking." />
      <Card className="glass-panel-strong max-w-3xl rounded-[32px] p-8">
        <form className="space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <Field label="Source account"><Select value={form.watch('accountId')} onValueChange={(value) => form.setValue('accountId', value)} placeholder="Select account" options={(accounts.data ?? []).map((account) => ({ label: `${account.accountName} • ${account.accountNumber}`, value: account.id }))} /></Field>
          {mode === 'transfer' ? <Field label="Destination account number"><Input {...form.register('destinationAccountNumber')} placeholder="Enter beneficiary account number" /></Field> : null}
          <Field label="Amount"><Input type="number" step="0.01" {...form.register('amount')} placeholder="0.00" /></Field>
          <Field label="Description"><Input {...form.register('description')} placeholder="Purpose / memo" /></Field>
          <div className="flex justify-end"><Button type="submit" size="lg">{titleMap[mode]}</Button></div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="mb-2 block text-sm text-slate-300">{label}</span>{children}</label>; }
