import { type NotificationEventType } from '@shared/domain/enums/notification-event-type.enum';

export interface NotificationPayload {
  event: NotificationEventType;
  data: Record<string, unknown>;
  timestamp: string;
}
