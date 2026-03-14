import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OUTBOX_REPOSITORY } from '../../application/tokens/outbox-repository.token';
import { RabbitMQModule } from '../messaging/rabbitmq.module';
import { OutboxMessageOrmEntity } from './outbox-message.orm-entity';
import { OutboxMessageRepository } from './outbox-message.repository';
import { OutboxPublisherService } from './outbox-publisher.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OutboxMessageOrmEntity]), RabbitMQModule],
  providers: [
    OutboxPublisherService,
    { provide: OUTBOX_REPOSITORY, useClass: OutboxMessageRepository },
  ],
  exports: [OUTBOX_REPOSITORY],
})
export class OutboxModule {}
