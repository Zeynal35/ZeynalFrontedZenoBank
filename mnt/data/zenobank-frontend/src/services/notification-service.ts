import { api, unwrap } from '@/lib/axios';
import type { AppNotification } from '@/types/domain';

export const notificationService = {
  getMine: () => unwrap<AppNotification[]>(api.get('/api/notifications/my')),
  getAll: () => unwrap<AppNotification[]>(api.get('/api/notifications')),
  readOne: (id: string) => unwrap(api.patch(`/api/notifications/${id}/read`)),
  readAll: () => unwrap(api.patch('/api/notifications/read-all')),
};
