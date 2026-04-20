import type { ReactNode } from 'react';
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { loanService, type CreateLoanPayload } from '@/services/loan-service';
import { accountService } from '@/services/account-service';
import { useAuthStore } from '@/store/auth-store';
import { currency, dateTime } from '@/lib/utils';

type FormValues = {
  disbursementAccountId: string;
  principalAmount: string;
  termInMonths: string;
  currency: string;
  purpose: string;
};

export function LoansPage() {
  const { customerProfile } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);

  const loansQuery = useQuery({ queryKey: ['loans'], queryFn: loanService.getMine });
  const accountsQuery = useQuery({ queryKey: ['accounts'], queryFn: accountService.getMine });

  const form = useForm<FormValues>({
    defaultValues: {
      disbursementAccountId: '',
      principalAmount: '',
      termInMonths: '12',
      currency: 'AZN',
      purpose: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      if (!customerProfile?.id) throw new Error('Customer profile not found');
      if (!values.disbursementAccountId) throw new Error('Please select a disbursement account');

      const payload: CreateLoanPayload = {
        customerProfileId: customerProfile.id,
        disbursementAccountId: values.disbursementAccountId,
        principalAmount: parseFloat(values.principalAmount),
        termInMonths: parseInt(values.termInMonths),
        currency: values.currency,
        purpose: values.purpose,
      };

      return loanService.create(payload);
    },
    onSuccess: () => {
      toast.success('Loan application submitted! Awaiting admin approval.');
      form.reset();
      setSubmitted(true);
      loansQuery.refetch();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to submit loan application');
    },
  });

  const accountOptions = (accountsQuery.data ?? []).map((a) => ({
    label: `${a.accountNumber} • ${a.currency} • ${a.balance}`,
    value: a.id,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Credit"
        title="Loans and applications"
        description="Apply for credit, track approval status, and monitor financed obligations. Admin review required before disbursement."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">

        {/* Apply form */}
        <Card className="glass-panel-strong rounded-[32px] p-8">
          <h3 className="text-xl font-semibold text-white">Apply for a loan</h3>
          <p className="mt-1 text-sm text-slate-400">
            Your application will be sent to admin for review and approval.
          </p>

          <form
            className="mt-6 space-y-4"
            onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          >
            {/* Disbursement account */}
            <Field label="Disbursement account">
              <Select
                value={form.watch('disbursementAccountId')}
                onValueChange={(v) => form.setValue('disbursementAccountId', v)}
                placeholder="Select account to receive funds"
                options={accountOptions}
              />
            </Field>

            {/* Amount */}
            <Field label="Requested amount">
              <Input
                type="number"
                step="0.01"
                min="1"
                {...form.register('principalAmount')}
                placeholder="5000.00"
              />
            </Field>

            {/* Term */}
            <Field label="Term (months)">
              <Select
                value={form.watch('termInMonths')}
                onValueChange={(v) => form.setValue('termInMonths', v)}
                placeholder="Select term"
                options={[
                  { label: '3 months', value: '3' },
                  { label: '6 months', value: '6' },
                  { label: '12 months', value: '12' },
                  { label: '24 months', value: '24' },
                  { label: '36 months', value: '36' },
                  { label: '60 months', value: '60' },
                ]}
              />
            </Field>

            {/* Currency */}
            <Field label="Currency">
              <Select
                value={form.watch('currency')}
                onValueChange={(v) => form.setValue('currency', v)}
                placeholder="Currency"
                options={[
                  { label: 'AZN', value: 'AZN' },
                  { label: 'USD', value: 'USD' },
                  { label: 'EUR', value: 'EUR' },
                ]}
              />
            </Field>

            {/* Purpose */}
            <Field label="Purpose">
              <Input
                {...form.register('purpose')}
                placeholder="e.g. Home renovation, Business expansion"
              />
            </Field>

            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? 'Submitting...' : 'Submit application'}
            </Button>
          </form>

          {submitted && (
            <div className="mt-4 rounded-2xl border border-amber-400/20 bg-amber-500/5 p-4 text-sm text-amber-300">
              ⏳ Application submitted — awaiting admin approval.
            </div>
          )}
        </Card>

        {/* Loan list */}
        <div className="space-y-4">
          {loansQuery.data?.length === 0 && (
            <Card className="rounded-[28px] py-10 text-center">
              <p className="text-slate-400 text-sm">No loan applications yet.</p>
            </Card>
          )}

          {(loansQuery.data ?? []).map((loan) => (
            <Card key={loan.id} className="rounded-[28px]">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{loan.purpose}</p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">
                    {currency(loan.principalAmount ?? loan.amount, loan.currency)}
                  </h3>
                </div>
                <StatusBadge value={loan.status} />
              </div>

              <div className="mt-4 grid gap-3 grid-cols-2 md:grid-cols-4 text-sm text-slate-400">
                <div>
                  <p>Term</p>
                  <p className="mt-1 text-white">{loan.termInMonths ?? loan.term} months</p>
                </div>
                <div>
                  <p>Currency</p>
                  <p className="mt-1 text-white">{loan.currency}</p>
                </div>
                {loan.interestRate != null && (
                  <div>
                    <p>Interest rate</p>
                    <p className="mt-1 text-white">{loan.interestRate}%</p>
                  </div>
                )}
                <div>
                  <p>Applied</p>
                  <p className="mt-1 text-white">{dateTime(loan.createdAt ?? loan.createdAtUtc)}</p>
                </div>
              </div>

              {loan.status === 'Rejected' && loan.rejectionReason && (
                <p className="mt-3 text-xs text-red-400 border border-red-400/20 bg-red-500/5 rounded-xl px-3 py-2">
                  Rejection reason: {loan.rejectionReason}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm text-slate-300">{label}</span>
      {children}
    </label>
  );
}

