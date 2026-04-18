import * as React from 'react';
import { cn } from '@/lib/utils';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-sky-400/20',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';
