import { Inject, Logger, type OnModuleInit } from '@nestjs/common';
import { type ChannelWrapper } from 'amqp-connection-manager';
import { type Channel, type ConsumeMessage } from 'amqplib';

import { RABBITMQ_CHANNEL } from '../tokens/rabbitmq-channel.token';

export abstract class AbstractIntegrationEventConsumer<TEvent> implements OnModuleInit {
  protected abstract readonly queue: string;
  protected abstract readonly routingKey: string;
  protected readonly logger = new Logger(this.constructor.name);

  constructor(@Inject(RABBITMQ_CHANNEL) protected readonly channel: ChannelWrapper) {}

  onModuleInit(): void {
    void this.channel.addSetup(async (channel: Channel) => {
      await channel.prefetch(1);
      await channel.consume(
        this.queue,
        (message: ConsumeMessage | null) => void this.onMessage(message, channel),
        { noAck: false },
      );

      this.logger.log(`Listening on queue: ${this.queue} for [${this.routingKey}]`);
    });
  }

  private async onMessage(message: ConsumeMessage | null, ch: Channel): Promise<void> {
    if (!message) {
      return;
    }

    const routingKey = message.fields.routingKey;
    if (routingKey !== this.routingKey) {
      ch.ack(message);
      return;
    }

    try {
      const content = message.content.toString();
      const event = JSON.parse(content) as TEvent;
      await this.handle(event);
      ch.ack(message);
    } catch (error) {
      this.logger.error(`Failed to process [${this.routingKey}]: ${(error as Error).message}`);
      ch.nack(message, false, false);
    }
  }

  protected abstract handle(event: TEvent): Promise<void>;
}
