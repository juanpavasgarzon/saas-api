import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { type IMessageBus } from '../../application/contracts/message-bus.contract';
import { type IOutboxMessageRepository } from '../../application/contracts/outbox-repository.contract';
import { MESSAGE_BUS } from '../../application/tokens/message-bus.token';
import { OUTBOX_REPOSITORY } from '../../application/tokens/outbox-repository.token';

@Injectable()
export class OutboxPublisherService {
  private readonly logger = new Logger(OutboxPublisherService.name);

  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outboxRepo: IOutboxMessageRepository,
    @Inject(MESSAGE_BUS) private readonly messageBus: IMessageBus,
  ) {}

  @Cron('*/5 * * * * *')
  async publishPending(): Promise<void> {
    const messages = await this.outboxRepo.findPending();
    for (const msg of messages) {
      try {
        await this.messageBus.publish(msg.eventName, msg.payload);
        await this.outboxRepo.markSent(msg.id);
      } catch (error) {
        this.logger.warn(`Failed to publish outbox message ${msg.id}: ${(error as Error).message}`);
        await this.outboxRepo.markFailed(msg.id, (error as Error).message, msg.attempts + 1);
      }
    }
  }
}
