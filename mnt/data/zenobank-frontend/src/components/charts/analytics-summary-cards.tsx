import { useQuery } from '@tanstack/react-query';
import { ArrowDownLeft, ArrowUpRight, BarChart3, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { analyticsService } from '@/services/analytics-service';
import { currency } from '@/lib/utils';

function MiniStat({ label, value, sub, icon: Icon, color, delay = 0 }: { label: string; value: string; sub?: string; icon: React.ElementType; color: string; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }}>
      <Card className="relative overflow-hidden rounded-[22px]">
        <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-20`} />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-2 text-xl font-semibold text-white">{value}</p>
            {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-2.5">
            <Icon className="h-4 w-4 text-slate-300" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function AnalyticsSummaryCards() {
  const { data } = useQuery({
    queryKey: ['analytics', 'mine'],
    queryFn: analyticsService.getMine,
  });

  const net = (data?.currentMonthDeposited ?? 0) - (data?.currentMonthWithdrawn ?? 0);
  const isPositive = net >= 0;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MiniStat label="Bu ay gəlir" value={currency(data?.currentMonthDeposited ?? 0)} sub="Tamamlanan depozitlər" icon={ArrowDownLeft} color="from-emerald-500/30 to-transparent" delay={0} />
      <MiniStat label="Bu ay xərc" value={currency(data?.currentMonthWithdrawn ?? 0)} sub="Tamamlanan çıxarışlar" icon={ArrowUpRight} color="from-rose-500/30 to-transparent" delay={0.05} />
      <MiniStat label="Net balans (bu ay)" value={`${isPositive ? '+' : ''}${currency(net)}`} sub={isPositive ? 'Müsbət axın' : 'Mənfi axın'} icon={TrendingUp} color={isPositive ? 'from-sky-500/30 to-transparent' : 'from-orange-500/30 to-transparent'} delay={0.1} />
      <MiniStat label="Orta əməliyyat" value={currency(data?.averageTransactionAmount ?? 0)} sub={`${data?.totalTransactionCount ?? 0} əməliyyat (son 6 ay)`} icon={BarChart3} color="from-violet-500/30 to-transparent" delay={0.15} />
    </div>
  );
}