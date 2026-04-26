import { useQuery } from '@tanstack/react-query';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/card';
import { analyticsService } from '@/services/analytics-service';
import { currency } from '@/lib/utils';

const COLORS: Record<string, string> = {
  Deposit: '#34d399',
  Withdraw: '#f87171',
  Transfer: '#818cf8',
};

function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export function TransactionTypeChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', 'mine'],
    queryFn: analyticsService.getMine,
  });

  const breakdown = data?.typeBreakdown ?? [];
  const chartData = breakdown.length > 0 ? breakdown : [{ type: 'No data', count: 1, totalAmount: 0, percentage: 100 }];

  return (
    <Card className="rounded-[28px]">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Tranzaksiya Növləri</h3>
        <p className="text-sm text-slate-400">Növə görə bölgü</p>
      </div>
      {isLoading ? (
        <div className="flex h-[200px] items-center justify-center text-slate-500 text-sm animate-pulse">Yüklənir...</div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={chartData} dataKey="count" nameKey="type" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} labelLine={false} label={renderCustomLabel}>
                {chartData.map((entry, index) => (
                  <Cell key={entry.type} fill={COLORS[entry.type] ?? ['#38bdf8', '#fb923c', '#a78bfa'][index % 3]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(2,6,23,0.96)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 14, fontSize: 13 }} formatter={(value: number, name: string, props: any) => [`${value} tranzaksiya · ${currency(props.payload.totalAmount)}`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-2">
            {breakdown.map((item, i) => (
              <div key={item.type} className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[item.type] ?? ['#38bdf8', '#fb923c', '#a78bfa'][i % 3] }} />
                  <span className="text-sm text-slate-300">{item.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-white">{item.count} əməliyyat</span>
                  <span className="ml-3 text-xs text-slate-400">{currency(item.totalAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}