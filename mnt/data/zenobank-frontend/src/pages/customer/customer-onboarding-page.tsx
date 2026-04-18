
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
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

  const mutation = useMutation({
    mutationFn: customerService.createMe,
    onSuccess: (profile) => {
      setCustomerProfile(profile);
      toast.success('Customer profile created successfully');
      navigate('/app/onboarding/kyc', { replace: true });
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to create customer profile',
      );
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate({
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: new Date(values.dateOfBirth).toISOString(),
      phoneNumber: values.phoneNumber,
      address: values.address,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">
          Onboarding
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-white">
          Complete customer registration
        </h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-400">
          Before accounts can be created, your banking identity needs a
          completed customer profile aligned with compliance and onboarding
          requirements.
        </p>
      </div>

      <Card className="glass-panel-strong max-w-4xl rounded-[32px] p-8">
        <form
          className="grid gap-6 md:grid-cols-2"
          onSubmit={handleSubmit(onSubmit)}
        >
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
            <Button type="submit" size="lg" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving profile...' : 'Continue to KYC'}
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
      {error ? (
        <span className="mt-2 block text-xs text-red-300">{error}</span>
      ) : null}
    </label>
  );
}