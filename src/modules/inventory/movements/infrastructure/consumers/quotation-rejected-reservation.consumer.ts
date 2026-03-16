import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type AmqpConnectionManager } from 'amqp-connection-manager';

import { type IInboxMessageRepository } from '@core/application/contracts/inbox-repository.contract';
import { QuotationRejectedIntegrationEvent } from '@core/application/events/quotation-rejected.integration-event';
import { INBOX_REPOSITORY } from '@core/application/tokens/inbox-repository.token';
import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CONNECTION } from '@core/infrastructure/tokens/rabbitmq-connection.token';

import { ReleaseStockReservationCommand } from '../../../stock/application/commands/release-stock-reservation/release-stock-reservation.command';

@Injectable()
export class QuotationRejectedReservationConsumer extends IntegrationEventConsumer<QuotationRejectedIntegrationEvent> {
  protected readonly queue = 'inventory.quotation-rejected.queue';
  protected readonly routingKey = QuotationRejectedIntegrationEvent.eventName;

  constructor(
    @Inject(RABBITMQ_CONNECTION) connection: AmqpConnectionManager,
    @Inject(INBOX_REPOSITORY) inboxRepo: IInboxMessageRepository,
    private readonly commandBus: CommandBus,
  ) {
    super(connection, inboxRepo);
  }

  protected async handle(event: QuotationRejectedIntegrationEvent): Promise<void> {
    for (const item of event.items) {
      if (item.itemType !== LineItemType.PRODUCT) {
        continue;
      }
      const command = new ReleaseStockReservationCommand(
        event.tenantId,
        item.itemId,
        item.quantity,
      );
      await this.commandBus.execute(command);
    }
  }
}
