import { CommandBus, EventBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { SaleApprovedIntegrationEvent } from '@shared/application/events/sale-approved.integration-event';

import { CreateInvoiceFromSaleCommand } from '../../../invoices/application/commands/create-invoice-from-sale/create-invoice-from-sale.command';
import { SaleApprovedEvent } from '../../domain/events/sale-approved.event';

@EventsHandler(SaleApprovedEvent)
export class SaleApprovedEventHandler implements IEventHandler<SaleApprovedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly eventBus: EventBus,
  ) {}

  async handle(event: SaleApprovedEvent): Promise<void> {
    const createInvoiceCommand = new CreateInvoiceFromSaleCommand(
      event.tenantId,
      event.saleId,
      event.customerId,
      event.items,
    );
    await this.commandBus.execute(createInvoiceCommand);

    this.eventBus.publish(
      new SaleApprovedIntegrationEvent(
        event.saleId,
        event.tenantId,
        event.items.map((i) => ({
          productId: null,
          description: i.description,
          quantity: i.quantity,
        })),
      ),
    );
  }
}
