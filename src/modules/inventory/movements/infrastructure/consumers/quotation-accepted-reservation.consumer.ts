import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type AmqpConnectionManager } from 'amqp-connection-manager';

import { type IInboxMessageRepository } from '@core/application/contracts/inbox-repository.contract';
import { QuotationAcceptedIntegrationEvent } from '@core/application/events/quotation-accepted.integration-event';
import { INBOX_REPOSITORY } from '@core/application/tokens/inbox-repository.token';
import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CONNECTION } from '@core/infrastructure/tokens/rabbitmq-connection.token';

import { ReserveStockCommand } from '../../../stock/application/commands/reserve-stock/reserve-stock.command';

@Injectable()
export class QuotationAcceptedReservationConsumer extends IntegrationEventConsumer<QuotationAcceptedIntegrationEvent> {
  protected readonly queue = 'inventory.quotation-accepted.queue';
  protected readonly routingKey = QuotationAcceptedIntegrationEvent.eventName;

  constructor(
    @Inject(RABBITMQ_CONNECTION) connection: AmqpConnectionManager,
    @Inject(INBOX_REPOSITORY) inboxRepo: IInboxMessageRepository,
    private readonly commandBus: CommandBus,
  ) {
    super(connection, inboxRepo);
  }

  protected async handle(event: QuotationAcceptedIntegrationEvent): Promise<void> {
    console.log(event);
    for (const item of event.items) {
      if (item.itemType !== LineItemType.PRODUCT) {
        continue;
      }

      const command = new ReserveStockCommand(
        event.tenantId,
        item.itemId,
        item.quantity,
        event.quotationId,
      );
      await this.commandBus.execute(command);
    }
  }
}
