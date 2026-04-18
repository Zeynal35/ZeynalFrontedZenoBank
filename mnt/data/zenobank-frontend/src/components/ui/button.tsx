import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
};

export function Button({ className, variant = 'primary', size = 'md', asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400/70 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-glow hover:scale-[1.01] hover:shadow-[0_0_35px_rgba(56,189,248,0.35)]': variant === 'primary',
          'glass-panel text-slate-100 hover:border-sky-300/25 hover:bg-white/[0.07]': variant === 'secondary',
          'bg-transparent text-slate-300 hover:bg-white/5 hover:text-white': variant === 'ghost',
          'border border-red-400/25 bg-red-500/10 text-red-200 hover:bg-red-500/15': variant === 'danger',
          'h-9 px-4 text-sm': size === 'sm',
          'h-11 px-5 text-sm': size === 'md',
          'h-12 px-6 text-base': size === 'lg',
          'h-11 w-11': size === 'icon',
        },
        className,
      )}
      {...props}
    />
  );
}
