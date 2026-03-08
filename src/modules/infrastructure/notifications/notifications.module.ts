import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { NOTIFICATION_SERVICE } from '@shared/application/tokens/notification-service.token';

import { NotificationService } from './application/services/notification.service';
import { NotificationGateway } from './infrastructure/gateways/notification.gateway';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [
    NotificationGateway,
    { provide: NOTIFICATION_SERVICE, useClass: NotificationService },
  ],
  exports: [NOTIFICATION_SERVICE],
})
export class NotificationsModule {}
