import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type Column<T> = {
  key: string;
  title: string;
  render: (row: T) => ReactNode;
  className?: string;
};

export function DataTable<T>({ columns, data, className }: { columns: Column<T>[]; data: T[]; className?: string }) {
  return (
    <div className={cn('glass-panel overflow-hidden rounded-3xl', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.03] text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className={cn('px-5 py-4 font-medium', column.className)}>{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="border-b border-white/5 text-slate-100 last:border-none"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 align-middle">{column.render(row)}</td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
