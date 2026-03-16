import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { type IMessageBus } from '../../application/contracts/message-bus.contract';
import { RABBITMQ_CHANNEL } from '../tokens/rabbitmq-channel.token';

@Injectable()
export class RabbitMQMessageBusService implements IMessageBus {
  private readonly logger = new Logger(RabbitMQMessageBusService.name);
  private readonly exchange: string;

  constructor(
    @Inject(RABBITMQ_CHANNEL) private readonly channel: ChannelWrapper,
    private readonly config: ConfigService,
  ) {
    this.exchange = this.config.get<string>('rabbitmq.exchange', 'integration.events');
  }

  async publish(
    routingKey: string,
    payload: Record<string, unknown>,
    messageId?: string,
  ): Promise<void> {
    try {
      await this.channel.publish(this.exchange, routingKey, payload, {
        persistent: true,
        contentType: 'application/json',
        timestamp: Date.now(),
        messageId,
      });
      this.logger.debug(`Published [${routingKey}]`);
    } catch (error) {
      this.logger.error(`Failed to publish [${routingKey}]: ${(error as Error).message}`);
      throw error;
    }
  }
}
