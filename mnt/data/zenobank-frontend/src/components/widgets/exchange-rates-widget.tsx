import { useExchangeRates } from '@/hooks/use-exchange-rates';
import { Card } from '@/components/ui/card';
import { TrendingUp, RefreshCw } from 'lucide-react';

export function ExchangeRatesWidget() {
  const { rates, loading, error, updatedAt } = useExchangeRates();

  return (
    <Card className="rounded-[28px]">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Valyuta Məzənnəsi</h3>
            <p className="text-xs text-slate-400">1 AZN = ?</p>
          </div>
        </div>
        {updatedAt && (
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <RefreshCw className="h-3 w-3" />
            {updatedAt}
          </div>
        )}
      </div>

      {loading && (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-2">
          {rates.map((r) => (
            <div
              key={r.code}
              className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{r.flagEmoji}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{r.code}</p>
                  <p className="text-[11px] text-slate-500">{r.name}</p>
                </div>
              </div>

              <div className="text-right">
                {/* 1 AZN = neçə xarici valyuta */}
                <p className="text-sm font-bold text-white">
                  {r.rateToAZN < 0.01
                    ? r.rateToAZN.toFixed(4)
                    : r.rateToAZN.toFixed(4)}{' '}
                  <span className="font-normal text-slate-400">{r.code}</span>
                </p>
                {/* 1 xarici = neçə AZN */}
                <p className="text-[11px] text-slate-500">
                  1 {r.code} = {r.aznToThis.toFixed(4)}{' '}
                  <span className="text-sky-400">₼</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-center text-[10px] text-slate-600">
        Məlumat: open.er-api.com · Hər saat yenilənir
      </p>
    </Card>
  );
}