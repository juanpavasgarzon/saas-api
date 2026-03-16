import { Global, Module } from '@nestjs/common';

import { MESSAGE_BUS } from '../../application/tokens/message-bus.token';
import { RABBITMQ_CHANNEL } from '../tokens/rabbitmq-channel.token';
import { RABBITMQ_CONNECTION } from '../tokens/rabbitmq-connection.token';
import { RabbitmqChannelProvider, RabbitmqConnectionProvider } from './rabbitmq-connection.provider';
import { RabbitMQMessageBusService } from './rabbitmq-message-bus.service';

@Global()
@Module({
  providers: [
    RabbitmqConnectionProvider,
    RabbitmqChannelProvider,
    RabbitMQMessageBusService,
    { provide: MESSAGE_BUS, useClass: RabbitMQMessageBusService },
  ],
  exports: [RABBITMQ_CONNECTION, RABBITMQ_CHANNEL, MESSAGE_BUS],
})
export class RabbitMQModule {}
