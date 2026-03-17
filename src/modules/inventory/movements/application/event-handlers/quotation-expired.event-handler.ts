import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { QuotationExpiredEvent } from '@modules/crm/quotations/domain/events/quotation-expired.event';
import { ReleaseStockReservationCommand } from '@modules/inventory/stock/application/commands/release-stock-reservation/release-stock-reservation.command';

@EventsHandler(QuotationExpiredEvent)
export class QuotationExpiredEventHandler implements IEventHandler<QuotationExpiredEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: QuotationExpiredEvent): Promise<void> {
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
