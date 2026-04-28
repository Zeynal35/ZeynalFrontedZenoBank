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

  const form = useForm<{ code: string; email: string }>({
    defaultValues: { code: '', email },
  });

  const verifyMutation = useMutation({
    mutationFn: (values: { code: string }) =>
      authService.confirmEmail(values.code.trim()),
    onSuccess: () =>
      toast.success('Email verified successfully. You can now login.'),
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Verification failed'),
  });

  const resendMutation = useMutation({
    mutationFn: (emailValue: string) =>
      authService.resendVerificationEmail(emailValue),
    onSuccess: () =>
      toast.success('A new 6-digit code was sent to your email'),
    onError: (error) =>
      toast.error(error instanceof Error ? error.message : 'Failed to resend'),
  });

  return (
    <Card className="glass-panel-strong w-full max-w-xl rounded-[32px] p-8">
      <p className="mb-2 text-xs uppercase tracking-[0.35em] text-sky-300/80">
        Email verification
      </p>
      <h2 className="text-3xl font-semibold text-white">Verify your email</h2>
      <p className="mt-3 text-sm text-slate-400">
        We sent a <span className="text-white font-medium">6-digit code</span> to{' '}
        {email ? (
          <span className="text-sky-300">{email}</span>
        ) : (
          'your email address'
        )}
        . Enter it below to activate your account.
      </p>

      <form
        className="mt-8 space-y-4"
        onSubmit={form.handleSubmit((values) =>
          verifyMutation.mutate({ code: values.code })
        )}
      >
        <Field label="6-digit verification code">
          <Input
            {...form.register('code')}
            placeholder="e.g. 047823"
            maxLength={6}
            inputMode="numeric"
            autoComplete="one-time-code"
            className="text-center text-2xl tracking-[0.5em] font-bold"
          />
        </Field>

        <Field label="Email">
          <Input
            {...form.register('email')}
            placeholder="name@domain.com"
          />
        </Field>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={verifyMutation.isPending}
        >
          {verifyMutation.isPending ? 'Verifying...' : 'Verify email'}
        </Button>
      </form>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="secondary"
          className="flex-1"
          disabled={resendMutation.isPending}
          onClick={() => {
            const emailValue = form.getValues('email');
            if (!emailValue) {
              toast.error('Please enter your email address first');
              return;
            }
            resendMutation.mutate(emailValue);
          }}
        >
          {resendMutation.isPending ? 'Sending...' : 'Resend code'}
        </Button>
        <Button variant="ghost" asChild className="flex-1">
          <Link to="/auth/login">Go to login</Link>
        </Button>
      </div>
    </Card>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-2 block text-slate-300">{label}</span>
      {children}
    </label>
  );
}

