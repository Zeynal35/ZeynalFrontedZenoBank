import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { customerService } from '@/services/customer-service';
import { Button } from '@/components/ui/button';

export function AdminKycPage() {
  const query = useQuery({ queryKey: ['admin-kyc'], queryFn: customerService.getAllKyc });
  const approve = useMutation({ mutationFn: customerService.approveKyc, onSuccess: () => query.refetch() });
  const reject = useMutation({ mutationFn: (id: string) => customerService.rejectKyc(id, 'Rejected by admin review'), onSuccess: () => query.refetch() });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="KYC queue" title="KYC management" description="Approve or reject verification documents with a secure operational interface designed for compliance workflows." />
      <DataTable data={query.data ?? []} columns={[
        { key: 'type', title: 'Type', render: (row) => row.documentType },
        { key: 'file', title: 'File', render: (row) => row.fileName },
        { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'created', title: 'Created', render: (row) => new Date(row.createdAt).toLocaleString() },
        { key: 'actions', title: 'Actions', render: (row) => <div className="flex gap-2"><Button size="sm" onClick={() => approve.mutate(row.id)}>Approve</Button><Button size="sm" variant="danger" onClick={() => reject.mutate(row.id)}>Reject</Button></div> },
      ]} />
    </div>
  );
}
