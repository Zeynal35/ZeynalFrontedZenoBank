import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { Card } from '@/components/ui/card';

const data = [
  { name: 'Jan', value: 25000 },
  { name: 'Feb', value: 32000 },
  { name: 'Mar', value: 28900 },
  { name: 'Apr', value: 41500 },
  { name: 'May', value: 47200 },
  { name: 'Jun', value: 51800 },
];

export function BalanceTrendChart() {
  return (
    <Card className="h-[340px] rounded-[28px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Liquidity trajectory</h3>
          <p className="text-sm text-slate-400">30-day portfolio balance movement</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="balanceFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ background: 'rgba(2,6,23,0.95)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: 16 }} />
          <Area type="monotone" dataKey="value" stroke="#38bdf8" fillOpacity={1} fill="url(#balanceFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
