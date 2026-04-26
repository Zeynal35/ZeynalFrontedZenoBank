import { useWorldClock } from '@/hooks/use-world-clock';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function WorldClockWidget() {
  const cities = useWorldClock();

  return (
    <Card className="rounded-[28px]">
      <div className="mb-5 flex items-center gap-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
          <Clock className="h-4 w-4 text-sky-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Dünya Saatı</h3>
          <p className="text-xs text-slate-400">8 paytaxtda cari vaxt</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cities.map((c) => (
          <div
            key={c.city}
            className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-3 transition-colors hover:bg-white/[0.06]"
          >
            {/* Bakı üçün vurğu */}
            {c.city === 'Bakı' && (
              <div className="absolute inset-0 rounded-2xl border border-sky-400/25 bg-sky-400/[0.04]" />
            )}
            <div className="relative">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xl">{c.flag}</span>
                <span className="text-[10px] text-slate-500">{c.offset}</span>
              </div>
              <p className="text-[11px] font-medium text-slate-400">{c.city}</p>
              <p className="mt-0.5 font-mono text-lg font-bold tracking-tight text-white">
                {c.time}
              </p>
              <p className="mt-0.5 text-[10px] text-slate-500">{c.date}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}