import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth-service';

const schema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});

type FormValues = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (_, variables) => {
      toast.success('Registration completed. Verify your email to continue.');
      navigate(`/auth/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
  });

  return (
    <Card className="glass-panel-strong w-full max-w-xl rounded-[32px] p-8">
      <p className="mb-2 text-xs uppercase tracking-[0.35em] text-sky-300/80">Create your secure access</p>
      <h2 className="text-3xl font-semibold text-white">Register for ZenoBank</h2>
      <p className="mt-3 text-sm text-slate-400">Open your banking workspace with premium onboarding, protected approvals, and institutional-grade controls.</p>
      <form className="mt-8 space-y-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
        <Field label="Full name" error={errors.fullName?.message}><Input {...register('fullName')} placeholder="Ariana Reed" /></Field>
        <Field label="Email" error={errors.email?.message}><Input {...register('email')} placeholder="name@domain.com" /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" error={errors.password?.message}><Input type="password" {...register('password')} placeholder="••••••••" /></Field>
          <Field label="Confirm password" error={errors.confirmPassword?.message}><Input type="password" {...register('confirmPassword')} placeholder="••••••••" /></Field>
        </div>
        <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>{mutation.isPending ? 'Creating secure profile...' : 'Register'}</Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-400">Already have an account? <Link className="text-sky-300 hover:text-sky-200" to="/auth/login">Login</Link></p>
    </Card>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="block text-sm"><span className="mb-2 block text-slate-300">{label}</span>{children}{error ? <span className="mt-2 block text-xs text-red-300">{error}</span> : null}</label>;
}
