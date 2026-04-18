import { useMutation, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { StatusBadge } from '@/components/ui/badge';
import { notificationService } from '@/services/notification-service';
import { dateTime } from '@/lib/utils';

export function NotificationsPage() {
  const query = useQuery({ queryKey: ['notifications'], queryFn: notificationService.getMine });
  const readAll = useMutation({ mutationFn: notificationService.readAll, onSuccess: () => query.refetch() });
  const readOne = useMutation({ mutationFn: notificationService.readOne, onSuccess: () => query.refetch() });

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="Notifications" title="Alerts and notices" description="Security events, account changes, transfer confirmations, and loan updates are surfaced in a clean, compliance-ready notification experience." actions={<Button variant="secondary" onClick={() => readAll.mutate()}>Mark all as read</Button>} />
      <div className="space-y-4">
        {(query.data ?? []).map((item) => (
          <Card key={item.id} className="rounded-[28px]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex items-center gap-3"><h3 className="text-lg font-semibold text-white">{item.title}</h3><StatusBadge value={item.type} /></div>
                <p className="mt-2 text-sm leading-7 text-slate-400">{item.message}</p>
                <p className="mt-3 text-xs text-slate-500">{dateTime(item.createdAt)}</p>
              </div>
              {!item.isRead ? <Button variant="ghost" onClick={() => readOne.mutate(item.id)}>Mark read</Button> : <span className="text-xs text-slate-500">Read</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
