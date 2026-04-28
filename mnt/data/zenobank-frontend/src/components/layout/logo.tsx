import { cn } from '@/lib/utils';
import zenoBankLogo from '@/assets/WhatsApp_Image_2026-04-28_at_20_53_49.jpeg';

export function ZenoBankLogo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* ── Şəkil logo ─────────────────────────────────────────── */}
      <img
        src={zenoBankLogo}
        alt="ZenoBank Logo"
        className="h-14 w-14 object-contain drop-shadow-lg"
      />

      {/* ── Mətn ────────────────────────────────────────────────── */}
      <div>
        <p className="text-lg font-semibold tracking-wide text-white">ZenoBank</p>
        <p className="text-[10px] uppercase tracking-[0.35em] text-sky-300/80">
          Premium Banking OS
        </p>
      </div>
    </div>
  );
}

