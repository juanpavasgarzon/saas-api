import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { generateId } from '@utils/uuid.util';

import { type IInboxMessageRepository } from '../../application/contracts/inbox-repository.contract';
import { InboxMessageStatus } from '../../domain/enums/inbox-message-status.enum';
import { InboxMessageOrmEntity } from './inbox-message.orm-entity';

@Injectable()
export class InboxMessageRepository implements IInboxMessageRepository {
  constructor(
    @InjectRepository(InboxMessageOrmEntity)
    private readonly repo: Repository<InboxMessageOrmEntity>,
  ) {}

  async isAlreadyProcessed(messageId: string, consumer: string): Promise<boolean> {
    const count = await this.repo.count({
      where: { messageId, consumer, status: InboxMessageStatus.PROCESSED },
    });
    return count > 0;
  }

  async saveIfNotExists(
    messageId: string,
    consumer: string,
    eventName: string,
    payload: Record<string, unknown>,
  ): Promise<string> {
    const existing = await this.repo.findOne({ where: { messageId, consumer } });
    if (existing) {
      return existing.id;
    }

    const id = generateId();
    const entity = this.repo.create({
      id,
      messageId,
      consumer,
      eventName,
      payload,
      status: InboxMessageStatus.RECEIVED,
      lastError: null,
      processedAt: null,
    });
    await this.repo.save(entity);
    return id;
  }

  async markProcessed(id: string): Promise<void> {
    await this.repo.update(id, {
      status: InboxMessageStatus.PROCESSED,
      processedAt: new Date(),
    });
  }

  async markFailed(id: string, error: string): Promise<void> {
    await this.repo.update(id, {
      status: InboxMessageStatus.FAILED,
      lastError: error,
    });
  }
}
