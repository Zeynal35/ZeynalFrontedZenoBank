import type { ReactNode } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SectionHeader } from '@/components/ui/section-header';
import { customerService } from '@/services/customer-service';
import { useAuthStore } from '@/store/auth-store';

export function ProfilePage() {
  const profile = useAuthStore((state) => state.customerProfile);
  const setCustomerProfile = useAuthStore((state) => state.setCustomerProfile);
  const form = useForm({ defaultValues: profile ?? { address: '', dateOfBirth: '', nationality: '', occupation: '' } });
  const mutation = useMutation({ mutationFn: customerService.updateMe, onSuccess: (result) => setCustomerProfile(result) });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Profile and settings" title="Customer profile" description="Maintain onboarding information, customer metadata, and settings that influence your banking permissions and account readiness." />
      <Card className="glass-panel-strong max-w-3xl rounded-[32px] p-8">
        <form className="grid gap-5 md:grid-cols-2" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <Field label="Address"><Input {...form.register('address')} /></Field>
          <Field label="Date of birth"><Input type="date" {...form.register('dateOfBirth')} /></Field>
          <Field label="Nationality"><Input {...form.register('nationality')} /></Field>
          <Field label="Occupation"><Input {...form.register('occupation')} /></Field>
          <div className="md:col-span-2 flex justify-end"><Button type="submit">Save changes</Button></div>
        </form>
      </Card>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="block"><span className="mb-2 block text-sm text-slate-300">{label}</span>{children}</label>; }
