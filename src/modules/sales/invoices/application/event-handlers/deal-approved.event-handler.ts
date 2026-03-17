import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { DealApprovedEvent } from '@modules/sales/deals/domain/events/deal-approved.event';

import { CreateInvoiceFromSaleCommand } from '../commands/create-invoice-from-sale/create-invoice-from-sale.command';

@EventsHandler(DealApprovedEvent)
export class DealApprovedEventHandler implements IEventHandler<DealApprovedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: DealApprovedEvent): Promise<void> {
    await this.commandBus.execute(
      new CreateInvoiceFromSaleCommand(event.tenantId, event.dealId, event.customerId, event.items),
    );
  }
}
