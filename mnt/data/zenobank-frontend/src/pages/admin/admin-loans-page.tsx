import { useMutation, useQuery } from '@tanstack/react-query';
import { loanService } from '@/services/loan-service';
import { SectionHeader } from '@/components/ui/section-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currency } from '@/lib/utils';

export function AdminLoansPage() {
  const query = useQuery({ queryKey: ['admin-loans'], queryFn: loanService.getAll });
  const approve = useMutation({ mutationFn: loanService.approve, onSuccess: () => query.refetch() });
  const reject = useMutation({ mutationFn: (id: string) => loanService.reject(id, 'Rejected by admin review'), onSuccess: () => query.refetch() });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Lending operations" title="Loans management" description="Approve or reject applications through a premium approval workspace with status clarity and consistent enterprise controls." />
      <DataTable data={query.data ?? []} columns={[
        { key: 'amount', title: 'Amount', render: (row) => currency(row.amount) },
        { key: 'term', title: 'Term', render: (row) => `${row.termMonths} months` },
        { key: 'purpose', title: 'Purpose', render: (row) => row.purpose },
        { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'actions', title: 'Actions', render: (row) => <div className="flex gap-2"><Button size="sm" onClick={() => approve.mutate(row.id)}>Approve</Button><Button size="sm" variant="danger" onClick={() => reject.mutate(row.id)}>Reject</Button></div> },
      ]} />
    </div>
  );
}
