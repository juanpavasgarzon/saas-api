import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { QuotationAcceptedIntegrationEvent } from '@core/application/events/quotation-accepted.integration-event';
import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CHANNEL } from '@core/infrastructure/tokens/rabbitmq-channel.token';

import { ReserveStockCommand } from '../../../stock/application/commands/reserve-stock/reserve-stock.command';

@Injectable()
export class QuotationAcceptedReservationConsumer extends IntegrationEventConsumer<QuotationAcceptedIntegrationEvent> {
  protected readonly queue = 'inventory.queue';
  protected readonly routingKey = QuotationAcceptedIntegrationEvent.eventName;

  constructor(
    @Inject(RABBITMQ_CHANNEL) channel: ChannelWrapper,
    private readonly commandBus: CommandBus,
  ) {
    super(channel);
  }

  protected async handle(event: QuotationAcceptedIntegrationEvent): Promise<void> {
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
