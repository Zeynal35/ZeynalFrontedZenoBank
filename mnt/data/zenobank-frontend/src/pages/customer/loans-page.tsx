import type { ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { loanService } from '@/services/loan-service';
import { currency, dateTime } from '@/lib/utils';

export function LoansPage() {
  const query = useQuery({ queryKey: ['loans'], queryFn: loanService.getMine });
  const form = useForm({ defaultValues: { amount: '', termMonths: 12, purpose: '' } });
  const mutation = useMutation({ mutationFn: loanService.create, onSuccess: () => query.refetch() });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Credit" title="Loans and applications" description="Apply for credit, track approval status, and monitor financed obligations inside a clear, premium lending workspace." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="glass-panel-strong rounded-[32px] p-8">
          <h3 className="text-xl font-semibold text-white">Apply for a loan</h3>
          <form className="mt-6 space-y-4" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
            <Field label="Amount"><Input type="number" {...form.register('amount')} placeholder="5000" /></Field>
            <Field label="Term (months)"><Input type="number" {...form.register('termMonths', { valueAsNumber: true })} /></Field>
            <Field label="Purpose"><Input {...form.register('purpose')} placeholder="Working capital" /></Field>
            <Button type="submit" className="w-full">Submit application</Button>
          </form>
        </Card>
        <div className="space-y-4">
          {(query.data ?? []).map((loan) => (
            <Card key={loan.id} className="rounded-[28px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{loan.purpose}</p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{currency(loan.amount)}</h3>
                </div>
                <StatusBadge value={loan.status} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-3 text-sm text-slate-400">
                <div><p>Interest</p><p className="mt-1 text-white">{loan.interestRate}%</p></div>
                <div><p>Monthly payment</p><p className="mt-1 text-white">{currency(loan.monthlyPayment)}</p></div>
                <div><p>Created</p><p className="mt-1 text-white">{dateTime(loan.createdAt)}</p></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="mb-2 block text-sm text-slate-300">{label}</span>{children}</label>; }
