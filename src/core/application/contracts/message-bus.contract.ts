export interface IMessageBus {
  publish(routingKey: string, payload: Record<string, unknown>, messageId?: string): Promise<void>;
}
