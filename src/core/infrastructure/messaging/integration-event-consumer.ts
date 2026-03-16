import { Inject, Logger, type OnModuleInit } from '@nestjs/common';
import { type AmqpConnectionManager } from 'amqp-connection-manager';
import { type Channel, type ConsumeMessage } from 'amqplib';

import { type IInboxMessageRepository } from '../../application/contracts/inbox-repository.contract';
import { INBOX_REPOSITORY } from '../../application/tokens/inbox-repository.token';
import { RABBITMQ_CONNECTION } from '../tokens/rabbitmq-connection.token';

export abstract class IntegrationEventConsumer<TEvent> implements OnModuleInit {
  protected abstract readonly queue: string;
  protected abstract readonly routingKey: string;
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    @Inject(RABBITMQ_CONNECTION) protected readonly connection: AmqpConnectionManager,
    @Inject(INBOX_REPOSITORY) private readonly inboxRepo: IInboxMessageRepository,
  ) {}

  onModuleInit(): void {
    const channel = this.connection.createChannel({
      json: true,
      setup: async (ch: Channel) => {
        await ch.prefetch(1);
        await ch.consume(
          this.queue,
          (message: ConsumeMessage | null) => void this.onMessage(message, ch),
          { noAck: false },
        );

        this.logger.log(`Listening on queue: ${this.queue} for [${this.routingKey}]`);
      },
    });

    void channel.waitForConnect();
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

    const messageId =
      (message.properties.messageId as string | undefined) ??
      Buffer.from(message.content).toString('base64url').slice(0, 36);

    let inboxId: string | undefined;

    try {
      const consumer = this.constructor.name;

      const alreadyProcessed = await this.inboxRepo.isAlreadyProcessed(messageId, consumer);
      if (alreadyProcessed) {
        this.logger.debug(
          `Skipping duplicate [${this.routingKey}] messageId=${messageId} consumer=${consumer}`,
        );
        ch.ack(message);
        return;
      }

      const content = message.content.toString();
      const event = JSON.parse(content) as TEvent;

      inboxId = await this.inboxRepo.saveIfNotExists(
        messageId,
        consumer,
        routingKey,
        JSON.parse(content) as Record<string, unknown>,
      );

      await this.handle(event);

      await this.inboxRepo.markProcessed(inboxId);
      ch.ack(message);
    } catch (error) {
      this.logger.error(`Failed to process [${this.routingKey}]: ${(error as Error).message}`);

      if (inboxId) {
        await this.inboxRepo.markFailed(inboxId, (error as Error).message).catch(() => undefined);
      }

      ch.nack(message, false, false);
    }
  }

  protected abstract handle(event: TEvent): Promise<void>;
}
