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
import { customerService } from '@/services/customer-service';
import { useAuthStore } from '@/store/auth-store';

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(true),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setSession, setCustomerProfile } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rememberMe: true },
  });

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: async (result) => {
      try {
        setSession({
          user: result.user,
          tokens: result.tokens,
        });

        toast.success('Login successful');

        try {
          const profile = await customerService.getMe();
          setCustomerProfile(profile);
          navigate('/app/dashboard', { replace: true });
        } catch {
          navigate('/app/onboarding/customer-profile', { replace: true });
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to complete login session',
        );
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Login failed');
    },
  });

  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <Card className="glass-panel-strong w-full max-w-xl rounded-[32px] p-8">
      <p className="mb-2 text-xs uppercase tracking-[0.35em] text-sky-300/80">
        Trusted access
      </p>

      <h2 className="text-3xl font-semibold text-white">
        Login to ZenoBank
      </h2>

      <p className="mt-3 text-sm text-slate-400">
        Continue to your banking workspace, approval queue, and account operations center.
      </p>

      <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <Field label="Email" error={errors.email?.message}>
          <Input type="email" placeholder="name@domain.com" {...register('email')} />
        </Field>

        <Field label="Password" error={errors.password?.message}>
          <Input type="password" placeholder="••••••••" {...register('password')} />
        </Field>

        <label className="flex items-center gap-3 text-sm text-slate-300">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 rounded border-white/10 bg-transparent"
          />
          Remember me
        </label>

        <div className="flex items-center justify-between text-sm">
          <button type="button" className="text-slate-400 hover:text-white">
            Forgot password
          </button>

          <Link className="text-sky-300 hover:text-sky-200" to="/auth/register">
            Back to register
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={mutation.isPending}>
          {mutation.isPending ? 'Authenticating...' : 'Login'}
        </Button>
      </form>
    </Card>
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