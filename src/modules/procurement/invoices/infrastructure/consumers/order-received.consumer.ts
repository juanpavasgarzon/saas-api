import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { OrderReceivedIntegrationEvent } from '@core/application/events/order-received.integration-event';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CHANNEL } from '@core/infrastructure/tokens/rabbitmq-channel.token';

import { CreateInvoiceCommand } from '../../application/commands/create-invoice/create-invoice.command';

@Injectable()
export class OrderReceivedInvoiceConsumer extends IntegrationEventConsumer<OrderReceivedIntegrationEvent> {
  protected readonly queue = 'procurement.queue';
  protected readonly routingKey = 'order.received';

  constructor(
    @Inject(RABBITMQ_CHANNEL) channel: ChannelWrapper,
    private readonly commandBus: CommandBus,
  ) {
    super(channel);
  }

  protected async handle(event: OrderReceivedIntegrationEvent): Promise<void> {
    const command = new CreateInvoiceCommand(
      event.tenantId,
      `SI-${event.orderId.slice(0, 8).toUpperCase()}`,
      event.supplierId,
      event.orderId,
      event.total,
      null,
      'Auto-generated from received purchase order',
    );
    await this.commandBus.execute(command);
  }
}
