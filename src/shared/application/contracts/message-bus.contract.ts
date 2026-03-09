export interface IMessageBus {
  publish(routingKey: string, payload: Record<string, unknown>): Promise<void>;
}
