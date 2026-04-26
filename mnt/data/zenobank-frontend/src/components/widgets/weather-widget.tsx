import { useWeather } from '@/hooks/use-weather';
import { Card } from '@/components/ui/card';
import { Wind, Droplets, Thermometer } from 'lucide-react';

export function WeatherWidget() {
  const { weather, loading, error } = useWeather();

  return (
    <Card className="rounded-[28px]">
      <div className="mb-5 flex items-center gap-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2">
          <Thermometer className="h-4 w-4 text-orange-400" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Hava Durumu</h3>
          <p className="text-xs text-slate-400">Bakı · London · İstanbul</p>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-white/[0.04]" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] px-4 py-3 text-sm text-rose-400">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-3">
          {weather.map((w) => (
            <div
              key={w.city}
              className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 transition-colors hover:bg-white/[0.06]"
            >
              {/* Bakı üçün vurğu */}
              {w.city === 'Bakı' && (
                <div className="absolute inset-0 rounded-2xl border border-sky-400/20 bg-sky-400/[0.03]" />
              )}
              <div className="relative flex items-center justify-between">
                {/* Sol: şəhər + vəziyyət */}
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{w.icon}</span>
                  <div>
                    <p className="font-semibold text-white">{w.city}</p>
                    <p className="text-xs text-slate-400">{w.condition}</p>
                  </div>
                </div>

                {/* Sağ: temperatur */}
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">{w.temp}°</p>
                  <p className="text-xs text-slate-500">Hiss: {w.feelsLike}°C</p>
                </div>
              </div>

              {/* Alt: rütubət + külək */}
              <div className="relative mt-3 flex gap-4 border-t border-white/[0.06] pt-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Droplets className="h-3.5 w-3.5 text-sky-400" />
                  <span>{w.humidity}% rütubət</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Wind className="h-3.5 w-3.5 text-sky-400" />
                  <span>{w.windSpeed} km/s külək</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="mt-3 text-center text-[10px] text-slate-600">
        Məlumat: open-meteo.com · Hər 15 dəqiqədə yenilənir
      </p>
    </Card>
  );
}