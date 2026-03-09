import { type NotificationEventType } from '../../domain/enums/notification-event-type.enum';

export interface INotificationService {
  emit(event: NotificationEventType, data: Record<string, unknown>): void;
  emitToUser(userId: string, event: NotificationEventType, data: Record<string, unknown>): void;
}
