import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { customerService } from '@/services/customer-service';
import { useAuthStore } from '@/store/auth-store';

const schema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phoneNumber: z.string().min(5, 'Phone number is required'),
  address: z.string().min(5, 'Address is required'),
});

type FormValues = z.infer<typeof schema>;

export function CustomerOnboardingPage() {
  const navigate = useNavigate();
  const { setCustomerProfile } = useAuthStore();

  // ✅ Mövcud profili yoxla
  const profileQuery = useQuery({
    queryKey: ['customer-me-check'],
    queryFn: customerService.getMe,
    retry: false,
  });

  // ✅ KYC sənədlərini yoxla (profil varsa)
  const kycQuery = useQuery({
    queryKey: ['kyc-check'],
    queryFn: customerService.getMyKyc,
    retry: false,
    enabled: !!profileQuery.data,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      address: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: customerService.createMe,
    onSuccess: (profile) => {
      setCustomerProfile(profile);
      toast.success('Profile created successfully');
      navigate('/app/onboarding/kyc', { replace: true });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create profile',
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    createMutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: new Date(values.dateOfBirth).toISOString(),
      phoneNumber: values.phoneNumber,
      address: values.address,
    });
  };

  // Yüklənir
  if (profileQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <p className="text-slate-400 text-sm animate-pulse">Checking profile...</p>
      </div>
    );
  }

  const existingProfile = profileQuery.data;
  const kycs = kycQuery.data ?? [];
  const kycApproved = kycs.some((k) => k.status === 'Approved');

  // ✅ Profil mövcuddur → göstər + yönləndir
  if (existingProfile) {
    setCustomerProfile(existingProfile);

    return (
      <div className="space-y-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Onboarding</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">
            Welcome back, {existingProfile.firstName}
          </h1>
          <p className="mt-3 max-w-3xl text-sm text-slate-400">
            Your customer profile is already set up. Choose where to continue.
          </p>
        </div>

        <Card className="glass-panel-strong max-w-4xl rounded-[32px] p-8">
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <InfoRow label="First name" value={existingProfile.firstName} />
            <InfoRow label="Last name" value={existingProfile.lastName} />
            <InfoRow
              label="Date of birth"
              value={new Date(existingProfile.dateOfBirth).toLocaleDateString()}
            />
            <InfoRow label="Phone" value={existingProfile.phoneNumber} />
            <div className="md:col-span-2">
              <InfoRow label="Address" value={existingProfile.address} />
            </div>
            <InfoRow label="Status" value={existingProfile.status ?? 'Active'} />
            <InfoRow
              label="KYC Status"
              value={
                kycApproved
                  ? '✅ Approved'
                  : kycs.length > 0
                  ? '⏳ Pending review'
                  : '❌ Not submitted'
              }
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            {!kycApproved && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/app/onboarding/kyc', { replace: true })}
              >
                {kycs.length > 0 ? 'View KYC status' : 'Submit KYC'}
              </Button>
            )}

            {/* ✅ KYC təsdiqlənibsə → birbaşa account yaratmağa */}
            {kycApproved ? (
              <Button
                size="lg"
                onClick={() => navigate('/app/accounts', { replace: true })}
              >
                Create Account →
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={() => navigate('/app/dashboard', { replace: true })}
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // ✅ Profil yoxdur → form göstər
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Onboarding</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          Complete customer registration
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-400">
          Before accounts can be created, your banking identity needs a completed
          customer profile aligned with compliance and onboarding requirements.
        </p>
      </div>

      <Card className="glass-panel-strong max-w-4xl rounded-[32px] p-8">
        <form className="grid gap-6 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <Field label="First name" error={errors.firstName?.message}>
            <Input placeholder="Nadir" {...register('firstName')} />
          </Field>

          <Field label="Last name" error={errors.lastName?.message}>
            <Input placeholder="Qasimov" {...register('lastName')} />
          </Field>

          <Field label="Date of birth" error={errors.dateOfBirth?.message}>
            <Input type="date" {...register('dateOfBirth')} />
          </Field>

          <Field label="Phone number" error={errors.phoneNumber?.message}>
            <Input placeholder="+994501234567" {...register('phoneNumber')} />
          </Field>

          <div className="md:col-span-2">
            <Field label="Address" error={errors.address?.message}>
              <Input
                placeholder="Coban-zade 37, Nizami rayonu, Baku"
                {...register('address')}
              />
            </Field>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" size="lg" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Continue to KYC'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block text-slate-300">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-xs text-red-300">{error}</span> : null}
    </label>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  );
}

