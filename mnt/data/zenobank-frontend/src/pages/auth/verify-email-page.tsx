import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth-service';
import { toast } from 'sonner';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const email = params.get('email') ?? '';
  const form = useForm<{ token: string; email: string }>({ defaultValues: { token: '', email } });

  const verifyMutation = useMutation({
    mutationFn: (values: { token: string }) => authService.confirmEmail(values.token),
    onSuccess: () => toast.success('Email verified. You can now login.'),
  });

  const resendMutation = useMutation({
    mutationFn: (emailValue: string) => authService.resendVerificationEmail(emailValue),
    onSuccess: () => toast.success('Verification email resent'),
  });

  return (
    <Card className="glass-panel-strong w-full max-w-xl rounded-[32px] p-8">
      <p className="mb-2 text-xs uppercase tracking-[0.35em] text-sky-300/80">Guided verification</p>
      <h2 className="text-3xl font-semibold text-white">Verify your email</h2>
      <p className="mt-3 text-sm text-slate-400">Paste the token from your email to unlock secure login. Verification keeps onboarding, KYC, and banking actions protected from the first session.</p>
      <form className="mt-8 space-y-4" onSubmit={form.handleSubmit((values) => verifyMutation.mutate({ token: values.token }))}>
        <Field label="Verification token"><Input {...form.register('token')} placeholder="Paste your verification token" /></Field>
        <Field label="Email"><Input {...form.register('email')} placeholder="name@domain.com" /></Field>
        <Button type="submit" className="w-full" size="lg">Verify email</Button>
      </form>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" className="flex-1" onClick={() => resendMutation.mutate(form.getValues('email'))}>Resend token</Button>
        <Button variant="ghost" asChild className="flex-1"><Link to="/auth/login">Go to login</Link></Button>
      </div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-sm"><span className="mb-2 block text-slate-300">{label}</span>{children}</label>;
}
