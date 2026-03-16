import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type AmqpConnectionManager } from 'amqp-connection-manager';

import { type IInboxMessageRepository } from '@core/application/contracts/inbox-repository.contract';
import { DealApprovedIntegrationEvent } from '@core/application/events/deal-approved.integration-event';
import { INBOX_REPOSITORY } from '@core/application/tokens/inbox-repository.token';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CONNECTION } from '@core/infrastructure/tokens/rabbitmq-connection.token';

import { CreateInvoiceFromSaleCommand } from '../../application/commands/create-invoice-from-sale/create-invoice-from-sale.command';

@Injectable()
export class DealApprovedBillingConsumer extends IntegrationEventConsumer<DealApprovedIntegrationEvent> {
  protected readonly queue = 'sales.deal-approved.queue';
  protected readonly routingKey = DealApprovedIntegrationEvent.eventName;

  constructor(
    @Inject(RABBITMQ_CONNECTION) connection: AmqpConnectionManager,
    @Inject(INBOX_REPOSITORY) inboxRepo: IInboxMessageRepository,
    private readonly commandBus: CommandBus,
  ) {
    super(connection, inboxRepo);
  }

  protected async handle(event: DealApprovedIntegrationEvent): Promise<void> {
    const command = new CreateInvoiceFromSaleCommand(
      event.tenantId,
      event.dealId,
      event.customerId,
      event.items,
    );
    await this.commandBus.execute(command);
  }
}
