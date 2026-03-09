import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type IntegrationEvent } from '../../domain/contracts/integration-event.contract';
import { type IOutboxMessageRepository } from '../../domain/contracts/outbox-repository.contract';
import { generateId } from '../../utils/uuid.util';
import { OutboxMessageOrmEntity } from './outbox-message.orm-entity';
import { OutboxMessageStatus } from './outbox-message-status.enum';

@Injectable()
export class OutboxMessageRepository implements IOutboxMessageRepository {
  constructor(
    @InjectRepository(OutboxMessageOrmEntity)
    private readonly repo: Repository<OutboxMessageOrmEntity>,
  ) {}

  async save(event: IntegrationEvent): Promise<void> {
    const { eventName, ...payload } = { ...event };
    const message = this.repo.create({
      id: generateId(),
      eventName,
      payload,
      status: OutboxMessageStatus.PENDING,
      attempts: 0,
      lastError: null,
    });
    await this.repo.save(message);
  }

  async findPending(): Promise<OutboxMessageOrmEntity[]> {
    return this.repo
      .createQueryBuilder('msg')
      .where('msg.status = :status::outbox_message_status_enum', {
        status: OutboxMessageStatus.PENDING,
      })
      .orderBy('msg."createdAt"', 'ASC')
      .take(50)
      .getMany();
  }

  async markSent(id: string): Promise<void> {
    await this.repo.update(id, { status: OutboxMessageStatus.SENT });
  }

  async markFailed(id: string, error: string, attempts: number): Promise<void> {
    await this.repo.update(id, {
      status: attempts >= 3 ? OutboxMessageStatus.FAILED : OutboxMessageStatus.PENDING,
      lastError: error,
      attempts,
    });
  }
}
