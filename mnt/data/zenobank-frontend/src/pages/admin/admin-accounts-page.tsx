import { useMutation, useQuery } from '@tanstack/react-query';
import { accountService } from '@/services/account-service';
import { SectionHeader } from '@/components/ui/section-header';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { currency } from '@/lib/utils';

export function AdminAccountsPage() {
  const query = useQuery({ queryKey: ['admin-accounts'], queryFn: accountService.getAll });
  const freeze = useMutation({ mutationFn: accountService.freeze, onSuccess: () => query.refetch() });
  const unfreeze = useMutation({ mutationFn: accountService.unfreeze, onSuccess: () => query.refetch() });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Accounts supervision" title="Accounts management" description="Control account status, inspect balances, and freeze or unfreeze financial products when review conditions require intervention." />
      <DataTable data={query.data ?? []} columns={[
        { key: 'number', title: 'Account', render: (row) => row.accountNumber },
        { key: 'name', title: 'Name', render: (row) => row.accountName },
        { key: 'balance', title: 'Balance', render: (row) => currency(row.balance, row.currency) },
        { key: 'status', title: 'Status', render: (row) => <StatusBadge value={row.status} /> },
        { key: 'action', title: 'Action', render: (row) => row.status === 'Frozen' ? <Button size="sm" variant="secondary" onClick={() => unfreeze.mutate(row.id)}>Unfreeze</Button> : <Button size="sm" variant="danger" onClick={() => freeze.mutate(row.id)}>Freeze</Button> },
      ]} />
    </div>
  );
}
