import { type NotificationEventType } from '@core/domain/enums/notification-event-type.enum';

export interface NotificationPayload {
  event: NotificationEventType;
  data: Record<string, unknown>;
  timestamp: string;
}
