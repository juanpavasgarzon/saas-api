import { type FactoryProvider, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqp-connection-manager';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { RABBITMQ_CHANNEL } from '../tokens/rabbitmq-channel.token';
import { QUEUE_BINDINGS } from './queue-bindings';

export const RabbitmqConnectionProvider: FactoryProvider = {
  provide: RABBITMQ_CHANNEL,
  inject: [ConfigService],
  useFactory: async (config: ConfigService): Promise<ChannelWrapper> => {
    const logger = new Logger('RabbitMQ');
    const url = config.getOrThrow<string>('rabbitmq.url');
    const exchange = config.get<string>('rabbitmq.exchange', 'integration.events');

    const connection = amqp.connect([url]);
    connection.on('connect', () => {
      logger.log('Connected to RabbitMQ');
    });

    connection.on('disconnect', ({ err }: { err?: Error }) => {
      logger.warn(`Disconnected: ${err?.message}`);
    });

    const channel = connection.createChannel({
      json: true,
      setup: async (ch: amqp.Channel) => {
        await ch.assertExchange(exchange, 'topic', {
          durable: true,
        });

        const bindings = Object.entries(QUEUE_BINDINGS);
        for (const [queueName, routingKeys] of bindings) {
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
