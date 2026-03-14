import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { NOTIFICATION_SERVICE } from '../../application/tokens/notification-service.token';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [
    NotificationGateway,
    { provide: NOTIFICATION_SERVICE, useClass: NotificationService },
  ],
  exports: [NOTIFICATION_SERVICE],
})
export class NotificationModule {}
