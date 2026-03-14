import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { QuotationRejectedIntegrationEvent } from '@core/application/events/quotation-rejected.integration-event';
import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CHANNEL } from '@core/infrastructure/tokens/rabbitmq-channel.token';

import { ReleaseStockReservationCommand } from '../../../stock/application/commands/release-stock-reservation/release-stock-reservation.command';

@Injectable()
export class QuotationRejectedReservationConsumer extends IntegrationEventConsumer<QuotationRejectedIntegrationEvent> {
  protected readonly queue = 'inventory.queue';
  protected readonly routingKey = QuotationRejectedIntegrationEvent.eventName;

  constructor(
    @Inject(RABBITMQ_CHANNEL) channel: ChannelWrapper,
    private readonly commandBus: CommandBus,
  ) {
    super(channel);
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
