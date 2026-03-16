export interface IInboxMessageRepository {
  isAlreadyProcessed(messageId: string, consumer: string): Promise<boolean>;

  saveIfNotExists(
    messageId: string,
    consumer: string,
    eventName: string,
    payload: Record<string, unknown>,
  ): Promise<string>;

  markProcessed(id: string): Promise<void>;

  markFailed(id: string, error: string): Promise<void>;
}
