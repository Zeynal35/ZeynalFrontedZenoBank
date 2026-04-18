import { useQuery } from '@tanstack/react-query';
import { useState, type ReactNode } from 'react';
import { DataTable } from '@/components/ui/data-table';
import { Modal } from '@/components/ui/dialog';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { transactionService } from '@/services/transaction-service';
import { currency, dateTime } from '@/lib/utils';
import type { Transaction } from '@/types/domain';

export function TransactionsPage() {
  const query = useQuery({ queryKey: ['transactions'], queryFn: transactionService.getMine });
  const [selected, setSelected] = useState<Transaction | null>(null);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Transactions" title="Money movement ledger" description="Track deposits, withdrawals, and transfers with premium detail views, polished states, and transparent status surfaces." />
      <DataTable
        data={query.data ?? []}
        columns={[
          { key: 'type', title: 'Type', render: (row) => row.type },
          { key: 'ref', title: 'Reference', render: (row) => row.reference },
          { key: 'amount', title: 'Amount', render: (row) => currency(row.amount, row.currency) },
          { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
          { key: 'createdAt', title: 'Created', render: (row) => dateTime(row.createdAt) },
          { key: 'action', title: '', render: (row) => <button className="text-sky-300" onClick={() => setSelected(row)}>View</button> },
        ]}
      />
      <Modal open={!!selected} onOpenChange={(open) => !open && setSelected(null)} title="Transaction detail">
        {selected ? (
          <div className="space-y-4 text-sm text-slate-300">
            <Row label="Type" value={selected.type} />
            <Row label="Status" value={<StatusBadge value={selected.status} />} />
            <Row label="Amount" value={currency(selected.amount, selected.currency)} />
            <Row label="Reference" value={selected.reference} />
            <Row label="Description" value={selected.description} />
            <Row label="Created at" value={dateTime(selected.createdAt)} />
          </div>
        ) : null}
      </Modal>
    </div>
  );
}

function Row({ label, value }: { label: string; value: ReactNode }) { return <div className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"><span>{label}</span><span>{value}</span></div>; }
