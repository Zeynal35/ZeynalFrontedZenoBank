import { cn } from '@/lib/utils';

export function ZenoBankLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-2xl border border-sky-300/20 bg-gradient-to-br from-blue-500/40 via-slate-950 to-cyan-400/20 shadow-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_30%)]" />
        <span className="text-lg font-semibold text-white">Z</span>
      </div>
      <div>
        <p className="text-lg font-semibold tracking-wide text-white">ZenoBank</p>
        <p className="text-[10px] uppercase tracking-[0.35em] text-sky-300/80">Premium Banking OS</p>
      </div>
    </div>
  );
}
