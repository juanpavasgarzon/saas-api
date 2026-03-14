import { Injectable } from '@nestjs/common';

import { type INotificationService } from '@core/application/contracts/notification-service.contract';
import { type NotificationEventType } from '@core/domain/enums/notification-event-type.enum';

import { type NotificationPayload } from '../../domain/contracts/notification-payload.contract';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService implements INotificationService {
  constructor(private readonly gateway: NotificationGateway) {}

  emit(event: NotificationEventType, data: Record<string, unknown>): void {
    const payload: NotificationPayload = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    this.gateway.broadcast(event, payload);
  }

  emitToUser(userId: string, event: NotificationEventType, data: Record<string, unknown>): void {
    const payload: NotificationPayload = {
      event,
      data,
      timestamp: new Date().toISOString(),
    };

    this.gateway.emitToUser(userId, event, payload);
  }
}
