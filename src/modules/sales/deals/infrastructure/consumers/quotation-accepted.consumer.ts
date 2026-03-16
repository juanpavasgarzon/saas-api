import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type AmqpConnectionManager } from 'amqp-connection-manager';

import { type IInboxMessageRepository } from '@core/application/contracts/inbox-repository.contract';
import { QuotationAcceptedIntegrationEvent } from '@core/application/events/quotation-accepted.integration-event';
import { INBOX_REPOSITORY } from '@core/application/tokens/inbox-repository.token';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CONNECTION } from '@core/infrastructure/tokens/rabbitmq-connection.token';

import { CreateDealFromQuotationCommand } from '../../application/commands/create-deal-from-quotation/create-deal-from-quotation.command';

@Injectable()
export class QuotationAcceptedConsumer extends IntegrationEventConsumer<QuotationAcceptedIntegrationEvent> {
  protected readonly queue = 'sales.quotation-accepted.queue';
  protected readonly routingKey = QuotationAcceptedIntegrationEvent.eventName;

  constructor(
    @Inject(RABBITMQ_CONNECTION) connection: AmqpConnectionManager,
    @Inject(INBOX_REPOSITORY) inboxRepo: IInboxMessageRepository,
    private readonly commandBus: CommandBus,
  ) {
    super(connection, inboxRepo);
  }

  protected async handle(event: QuotationAcceptedIntegrationEvent): Promise<void> {
    const command = new CreateDealFromQuotationCommand(
      event.tenantId,
      event.quotationId,
      event.customerId,
      event.items,
    );
    await this.commandBus.execute(command);
  }
}
