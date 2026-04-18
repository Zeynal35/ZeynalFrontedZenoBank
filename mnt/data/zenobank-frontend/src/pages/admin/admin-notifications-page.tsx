import { useQuery } from '@tanstack/react-query';
import { notificationService } from '@/services/notification-service';
import { SectionHeader } from '@/components/ui/section-header';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { dateTime } from '@/lib/utils';

export function AdminNotificationsPage() {
  const query = useQuery({ queryKey: ['admin-notifications'], queryFn: notificationService.getAll });
  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Alerts control" title="Notifications management" description="Inspect system-wide notifications across security, account, transfer, and lending events in a unified enterprise feed." />
      <div className="space-y-4">{(query.data ?? []).map((item) => <Card key={item.id} className="rounded-[28px]"><div className="flex items-center justify-between gap-4"><div><div className="flex items-center gap-3"><h3 className="font-semibold text-white">{item.title}</h3><StatusBadge value={item.type} /></div><p className="mt-2 text-sm text-slate-400">{item.message}</p></div><span className="text-xs text-slate-500">{dateTime(item.createdAt)}</span></div></Card>)}</div>
    </div>
  );
}
