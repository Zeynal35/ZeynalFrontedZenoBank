import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { analyticsService } from '@/services/analytics-service';
import { currency } from '@/lib/utils';

export function MonthlyVolumeChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'mine'],
    queryFn: analyticsService.getMine,
  });

  const now = new Date();
  const chartData = (data?.monthlySummary ?? []).map((m) => ({
    name: m.monthLabel,
    Həcm: m.totalDeposited + m.totalWithdrawn + m.totalTransferred,
    isCurrentMonth: m.month === now.getMonth() + 1 && m.year === now.getFullYear(),
  }));

  return (
    <Card className="rounded-[28px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Aylıq Həcm</h3>
          <p className="text-sm text-slate-400">Bütün tranzaksiyaların cəmi</p>
        </div>
        {isLoading && <span className="text-xs text-slate-500 animate-pulse">Yüklənir...</span>}
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barSize={28} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={44} />
          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)', radius: 8 }} contentStyle={{ background: 'rgba(2,6,23,0.96)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, fontSize: 13 }} formatter={(value: number) => [currency(value), 'Həcm']} />
          <Bar dataKey="Həcm" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.isCurrentMonth ? 'rgba(56,189,248,0.85)' : 'rgba(56,189,248,0.25)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}