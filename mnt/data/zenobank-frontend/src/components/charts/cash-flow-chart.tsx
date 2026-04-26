import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card } from '@/components/ui/card';
import { analyticsService } from '@/services/analytics-service';
import { currency } from '@/lib/utils';

export function CashFlowChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'mine'],
    queryFn: analyticsService.getMine,
  });

  const chartData = (data?.monthlySummary ?? []).map((m) => ({
    name: m.monthLabel,
    Deposited: m.totalDeposited,
    Withdrawn: m.totalWithdrawn,
    'Net Flow': m.netFlow,
  }));

  return (
    <Card className="rounded-[28px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Cash Flow</h3>
          <p className="text-sm text-slate-400">Son 6 ayın gəlir / xərc hərəkəti</p>
        </div>
        {isLoading && <span className="text-xs text-slate-500 animate-pulse">Yüklənir...</span>}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradDeposit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradWithdraw" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={48} />
          <Tooltip contentStyle={{ background: 'rgba(2,6,23,0.96)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16, fontSize: 13 }} formatter={(value: number, name: string) => [currency(value), name]} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: 12 }} />
          <Area type="monotone" dataKey="Deposited" stroke="#34d399" strokeWidth={2} fill="url(#gradDeposit)" />
          <Area type="monotone" dataKey="Withdrawn" stroke="#f87171" strokeWidth={2} fill="url(#gradWithdraw)" />
          <Area type="monotone" dataKey="Net Flow" stroke="#38bdf8" strokeWidth={2} strokeDasharray="4 3" fill="url(#gradNet)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}