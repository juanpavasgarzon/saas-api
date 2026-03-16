import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type AmqpConnectionManager } from 'amqp-connection-manager';

import { type IInboxMessageRepository } from '@core/application/contracts/inbox-repository.contract';
import { OrderReceivedIntegrationEvent } from '@core/application/events/order-received.integration-event';
import { INBOX_REPOSITORY } from '@core/application/tokens/inbox-repository.token';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CONNECTION } from '@core/infrastructure/tokens/rabbitmq-connection.token';

import { CreateInvoiceCommand } from '../../application/commands/create-invoice/create-invoice.command';

@Injectable()
export class OrderReceivedInvoiceConsumer extends IntegrationEventConsumer<OrderReceivedIntegrationEvent> {
  protected readonly queue = 'procurement.order-received.queue';
  protected readonly routingKey = OrderReceivedIntegrationEvent.eventName;

  constructor(
    @Inject(RABBITMQ_CONNECTION) connection: AmqpConnectionManager,
    @Inject(INBOX_REPOSITORY) inboxRepo: IInboxMessageRepository,
    private readonly commandBus: CommandBus,
  ) {
    super(connection, inboxRepo);
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
