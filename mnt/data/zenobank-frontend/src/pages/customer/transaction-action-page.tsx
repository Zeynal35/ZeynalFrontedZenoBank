import type { ReactNode } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/ui/section-header';
import { accountService } from '@/services/account-service';
import { transactionService } from '@/services/transaction-service';

type FormValues = {
  accountId: string;
  toAccountNumber: string;
  amount: string;
  description: string;
  currency: string;
};

const titleMap = {
  deposit: 'Deposit funds',
  withdraw: 'Withdraw funds',
  transfer: 'Transfer funds',
};

export function TransactionActionPage({ mode }: { mode: 'deposit' | 'withdraw' | 'transfer' }) {
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: accountService.getMine });

  const form = useForm<FormValues>({
    defaultValues: {
      accountId: '',
      toAccountNumber: '',
      amount: '',
      description: '',
      currency: 'AZN',
    },
  });

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const amount = parseFloat(values.amount);
      if (!values.accountId) throw new Error('Please select an account');
      if (!amount || amount <= 0) throw new Error('Please enter a valid amount');

      // ✅ Backend field adlarına uyğun payload
      if (mode === 'deposit') {
        return transactionService.deposit({
          toAccountId: values.accountId,
          amount,
          currency: values.currency,
          description: values.description,
        });
      }

      if (mode === 'withdraw') {
        return transactionService.withdraw({
          fromAccountId: values.accountId,
          amount,
          currency: values.currency,
          description: values.description,
        });
      }

      // transfer
      if (!values.toAccountNumber) throw new Error('Please enter destination account number');
      return transactionService.transfer({
        fromAccountId: values.accountId,
        toAccountNumber: values.toAccountNumber,
        amount,
        currency: values.currency,
        description: values.description,
      });
    },
    onSuccess: () => {
      toast.success(`${titleMap[mode]} completed successfully!`);
      form.reset();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Transaction failed');
    },
  });

  const accountOptions = (accounts.data ?? []).map((a) => ({
    label: `${a.accountNumber} • ${a.currency} • ${a.balance}`,
    value: a.id,
  }));

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Secure transaction"
        title={titleMap[mode]}
        description="Execute controlled movement with clear account selection, validation, and secure banking operations."
      />

      <Card className="glass-panel-strong max-w-3xl rounded-[32px] p-8">
        <form
          className="space-y-5"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          {/* Account seç */}
          <Field label={mode === 'deposit' ? 'Deposit to account' : 'From account'}>
            <Select
              value={form.watch('accountId')}
              onValueChange={(value) => form.setValue('accountId', value)}
              placeholder="Select account"
              options={accountOptions}
            />
          </Field>

          {/* Transfer üçün — to account */}
          {mode === 'transfer' && (
            <Field label="Destination account number">
              <Input
                {...form.register('toAccountNumber')}
                placeholder="e.g. AZ123456789012"
              />
            </Field>
          )}

          {/* Amount */}
          <Field label="Amount">
            <Input
              type="number"
              step="0.01"
              min="0.01"
              {...form.register('amount')}
              placeholder="0.00"
            />
          </Field>

          {/* Currency */}
          <Field label="Currency">
            <Select
              value={form.watch('currency')}
              onValueChange={(value) => form.setValue('currency', value)}
              placeholder="Currency"
              options={[
                { label: 'AZN', value: 'AZN' },
                { label: 'USD', value: 'USD' },
                { label: 'EUR', value: 'EUR' },
              ]}
            />
          </Field>

          {/* Description */}
          <Field label="Description">
            <Input
              {...form.register('description')}
              placeholder="Purpose / memo"
            />
          </Field>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={mutation.isPending}>
              {mutation.isPending ? 'Processing...' : titleMap[mode]}
            </Button>
          </div>
        </form>
      </Card>
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

