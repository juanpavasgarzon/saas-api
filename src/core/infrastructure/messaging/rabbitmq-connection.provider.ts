import { type FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { type AmqpConnectionManager, type ChannelWrapper } from 'amqp-connection-manager';

import { RABBITMQ_CHANNEL } from '../tokens/rabbitmq-channel.token';
import { RABBITMQ_CONNECTION } from '../tokens/rabbitmq-connection.token';
import { QUEUE_BINDINGS } from './queue-bindings';

export const RabbitmqConnectionProvider: FactoryProvider = {
  provide: RABBITMQ_CONNECTION,
  inject: [ConfigService],
  useFactory: (config: ConfigService): AmqpConnectionManager => {
    const logger = new Logger('RabbitMQ');
    const url = config.getOrThrow<string>('rabbitmq.url');

    const connection = amqp.connect([url]);
    connection.on('connect', () => {
      logger.log('Connected to RabbitMQ');
    });
    connection.on('disconnect', ({ err }: { err?: Error }) => {
      logger.warn(`Disconnected: ${err?.message}`);
    });

    return connection;
  },
};

export const RabbitmqChannelProvider: FactoryProvider = {
  provide: RABBITMQ_CHANNEL,
  inject: [RABBITMQ_CONNECTION, ConfigService],
  useFactory: async (
    connection: AmqpConnectionManager,
    config: ConfigService,
  ): Promise<ChannelWrapper> => {
    const logger = new Logger('RabbitMQ');
    const exchange = config.get<string>('rabbitmq.exchange', 'integration.events');

    const channel = connection.createChannel({
      json: true,
      setup: async (ch: amqp.Channel) => {
        await ch.assertExchange(exchange, 'topic', { durable: true });

        for (const [queueName, routingKeys] of Object.entries(QUEUE_BINDINGS)) {
          await ch.assertQueue(queueName, { durable: true });
          for (const key of routingKeys) {
            await ch.bindQueue(queueName, exchange, key);
          }
        }

        logger.log('Exchange and queues initialized');
      },
    });

    await channel.waitForConnect();
    return channel;
  },
};
