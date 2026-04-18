import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transaction-service';
import { SectionHeader } from '@/components/ui/section-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/badge';
import { currency, dateTime } from '@/lib/utils';

export function AdminTransactionsPage() {
  const query = useQuery({ queryKey: ['admin-transactions'], queryFn: transactionService.getAll });
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Transaction controls" title="Transactions management" description="Review gateway-wide money movement across deposits, withdrawals, and transfers with status-aware operational oversight." />
      <DataTable data={query.data ?? []} columns={[
        { key: 'type', title: 'Type', render: (row) => row.type },
        { key: 'ref', title: 'Reference', render: (row) => row.reference },
        { key: 'amount', title: 'Amount', render: (row) => currency(row.amount, row.currency) },
        { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'created', title: 'Created', render: (row) => dateTime(row.createdAt) },
      ]} />
    </div>
  );
}
