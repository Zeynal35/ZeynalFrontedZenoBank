import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Clock, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { accountService } from '@/services/account-service';
import { customerService } from '@/services/customer-service';
import { useAuthStore } from '@/store/auth-store';
import { currency, dateTime } from '@/lib/utils';

export function AccountsPage() {
  const { customerProfile } = useAuthStore();
  const [open, setOpen] = useState(false);

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: accountService.getMine,
  });

  const kycQuery = useQuery({
    queryKey: ['my-kyc'],
    queryFn: customerService.getMyKyc,
    retry: false,
  });

  const form = useForm<{ accountName: string; accountType: 'Current' | 'Savings'; currency: string }>({
    defaultValues: { accountName: '', accountType: 'Current', currency: 'AZN' },
  });

  const createMutation = useMutation({
    mutationFn: (values: { accountName: string; accountType: 'Current' | 'Savings'; currency: string }) => {
      if (!customerProfile?.id) throw new Error('Customer profile not found');
      return accountService.create({
        customerProfileId: customerProfile.id,
        accountType: values.accountType,
        currency: values.currency,
      });
    },
    onSuccess: async () => {
      toast.success('Account created successfully!');
      await accountsQuery.refetch();
      setOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    },
  });

  const kycs = kycQuery.data ?? [];
  const kycApproved = kycs.some((k) => k.status === 'Approved');
  const kycPending = kycs.some((k) => k.status === 'Pending');
  const kycRejected = kycs.some((k) => k.status === 'Rejected');
  const kycNotSubmitted = kycs.length === 0;

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Accounts"
        title="Your account portfolio"
        description="Create and manage your bank accounts after KYC approval."
        actions={
          <Button onClick={() => setOpen(true)} disabled={!kycApproved}>
            <Plus className="mr-2 h-4 w-4" />
            Create account
          </Button>
        }
      />

      {/* KYC status banner */}
      {!kycApproved && (
        <Card className="rounded-[28px] border border-amber-400/20 bg-amber-500/5 p-6">
          <div className="flex items-start gap-4">
            {kycPending && (
              <>
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500/10">
                  <Clock className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">KYC Təsdiqini Gözləyin</h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Sənədləriniz yoxlanılır. KYC təsdiq edildikdən sonra hesab yarada biləcəksiniz. Adətən <span className="text-amber-300">24-48 saat</span> çəkir.
                  </p>
                </div>
              </>
            )}
            {kycRejected && (
              <>
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
                  <ShieldCheck className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">KYC Rədd Edildi</h3>
                  <p className="mt-1 text-sm text-slate-400">Zəhmət olmasa yeni sənəd yükləyin.</p>
                  <Link to="/app/onboarding/kyc" className="mt-2 inline-block text-sm text-sky-400 hover:text-sky-300">Yenidən göndər →</Link>
                </div>
              </>
            )}
            {kycNotSubmitted && (
              <>
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-500/10">
                  <ShieldCheck className="h-5 w-5 text-slate-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">KYC Tələb Olunur</h3>
                  <p className="mt-1 text-sm text-slate-400">Hesab yaratmaq üçün əvvəlcə KYC göndərin.</p>
                  <Link to="/app/onboarding/kyc" className="mt-2 inline-block text-sm text-sky-400 hover:text-sky-300">KYC Göndər →</Link>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {kycApproved && (
        <Card className="rounded-[28px] border border-green-400/20 bg-green-500/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-500/10">
              <ShieldCheck className="h-4 w-4 text-green-400" />
            </div>
            <p className="text-sm text-white">KYC təsdiqləndi — hesab yarada bilərsiniz ✓</p>
          </div>
        </Card>
      )}

      {/* Account list */}
      <div className="grid gap-5 xl:grid-cols-2">
        {(accountsQuery.data ?? []).map((account) => (
          <Link key={account.id} to={`/app/accounts/${account.id}`}>
            <Card className="rounded-[28px] transition hover:-translate-y-1 hover:border-sky-400/20 hover:bg-white/[0.05]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{account.accountType} account</p>
                  <h3 className="mt-2 text-2xl font-semibold text-white">{account.accountName ?? account.accountNumber}</h3>
                  <p className="mt-2 text-sm text-slate-500">{account.accountNumber}</p>
                </div>
                <StatusBadge value={account.status} />
              </div>
              <div className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-400">Available balance</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {currency(account.balance, account.currency)}
                  </p>
                </div>
                <p className="text-xs text-slate-500">Opened {dateTime(account.createdAt)}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Create account modal */}
      <Modal open={open} onOpenChange={setOpen} title="Create a new account">
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit((values) => createMutation.mutate(values))}
        >
          <Field label="Account type">
            <Select
              value={form.watch('accountType')}
              onValueChange={(value) => form.setValue('accountType', value as 'Current' | 'Savings')}
              placeholder="Choose account type"
              options={[
                { label: 'Current', value: 'Current' },
                { label: 'Savings', value: 'Savings' },
              ]}
            />
          </Field>

          <Field label="Currency">
            <Select
              value={form.watch('currency')}
              onValueChange={(value) => form.setValue('currency', value)}
              placeholder="Choose currency"
              options={[
                { label: 'AZN', value: 'AZN' },
                { label: 'USD', value: 'USD' },
                { label: 'EUR', value: 'EUR' },
              ]}
            />
          </Field>

          <div className="flex justify-end">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create account'}
            </Button>
          </div>
        </form>
      </Modal>
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

