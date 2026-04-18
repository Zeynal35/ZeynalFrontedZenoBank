import { useMutation, useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/ui/data-table';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { customerService } from '@/services/customer-service';
import { Button } from '@/components/ui/button';

export function AdminCustomersPage() {
  const query = useQuery({ queryKey: ['admin-customers'], queryFn: customerService.getAll });
  const blacklist = useMutation({ mutationFn: customerService.blacklist, onSuccess: () => query.refetch() });
  const unblacklist = useMutation({ mutationFn: customerService.unblacklist, onSuccess: () => query.refetch() });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Admin customers" title="Customer management" description="Review customer lifecycle state, risk profile, and blacklist controls with institutional-grade administrative ergonomics." />
      <DataTable data={query.data ?? []} columns={[
        { key: 'name', title: 'Customer', render: (row) => row.fullName },
        { key: 'email', title: 'Email', render: (row) => row.email },
        { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'risk', title: 'Risk', render: (row) => <StatusBadge value={row.riskLevel} /> },
        { key: 'blacklist', title: 'Blacklist', render: (row) => row.blacklisted ? 'Yes' : 'No' },
        { key: 'action', title: 'Action', render: (row) => row.blacklisted ? <Button size="sm" variant="secondary" onClick={() => unblacklist.mutate(row.id)}>Unblacklist</Button> : <Button size="sm" variant="danger" onClick={() => blacklist.mutate(row.id)}>Blacklist</Button> },
      ]} />
    </div>
  );
}
