import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { QuotationRejectedEvent } from '@modules/crm/quotations/domain/events/quotation-rejected.event';
import { ReleaseStockReservationCommand } from '@modules/inventory/stock/application/commands/release-stock-reservation/release-stock-reservation.command';

@EventsHandler(QuotationRejectedEvent)
export class QuotationRejectedEventHandler implements IEventHandler<QuotationRejectedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: QuotationRejectedEvent): Promise<void> {
    for (const item of event.items) {
      if (item.itemType !== LineItemType.PRODUCT) {
        continue;
      }
      await this.commandBus.execute(
        new ReleaseStockReservationCommand(event.tenantId, item.itemId, item.quantity),
      );
    }
  }
}
