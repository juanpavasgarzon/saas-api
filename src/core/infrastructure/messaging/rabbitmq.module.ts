import { Global, Module } from '@nestjs/common';

import { MESSAGE_BUS } from '../../application/tokens/message-bus.token';
import { RABBITMQ_CHANNEL } from '../tokens/rabbitmq-channel.token';
import { RabbitmqConnectionProvider } from './rabbitmq-connection.provider';
import { RabbitMQMessageBusService } from './rabbitmq-message-bus.service';

@Global()
@Module({
  providers: [
    RabbitmqConnectionProvider,
    RabbitMQMessageBusService,
    { provide: MESSAGE_BUS, useClass: RabbitMQMessageBusService },
  ],
  exports: [RABBITMQ_CHANNEL, MESSAGE_BUS, RabbitMQMessageBusService],
})
export class RabbitMQModule {}
