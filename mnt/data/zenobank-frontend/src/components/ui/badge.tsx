import { cn } from '@/lib/utils';

const tones: Record<string, string> = {
  Active: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  Approved: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  Completed: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  Pending: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  Rejected: 'border-red-400/20 bg-red-500/10 text-red-200',
  Failed: 'border-red-400/20 bg-red-500/10 text-red-200',
  Frozen: 'border-blue-400/20 bg-blue-500/10 text-blue-200',
  Suspended: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  Blocked: 'border-red-400/20 bg-red-500/10 text-red-200',
  High: 'border-red-400/20 bg-red-500/10 text-red-200',
  Medium: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  Low: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  Security: 'border-violet-400/20 bg-violet-500/10 text-violet-200',
  Account: 'border-blue-400/20 bg-blue-500/10 text-blue-200',
  Loan: 'border-cyan-400/20 bg-cyan-500/10 text-cyan-200',
  Deposit: 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200',
  Withdraw: 'border-amber-400/20 bg-amber-500/10 text-amber-200',
  Transfer: 'border-sky-400/20 bg-sky-500/10 text-sky-200',
};

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium', tones[value] ?? 'border-white/10 bg-white/5 text-slate-200', className)}>
      {value}
    </span>
  );
}
