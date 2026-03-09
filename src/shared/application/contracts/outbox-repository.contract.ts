import { type IntegrationEvent } from '../../domain/contracts/integration-event.contract';

export interface OutboxMessage {
  id: string;
  eventName: string;
  payload: Record<string, unknown>;
  attempts: number;
}

export interface IOutboxMessageRepository {
  save(event: IntegrationEvent): Promise<void>;
  findPending(): Promise<OutboxMessage[]>;
  markSent(id: string): Promise<void>;
  markFailed(id: string, error: string, attempts: number): Promise<void>;
}
