import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function StatCard({ title, value, subtitle, icon: Icon }: { title: string; value: string; subtitle?: string; icon: LucideIcon }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
      <Card className="relative overflow-hidden rounded-[28px]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-400/10" />
        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
            {subtitle ? <p className="mt-2 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="rounded-2xl border border-sky-400/20 bg-sky-500/10 p-3">
            <Icon className="h-5 w-5 text-sky-300" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
