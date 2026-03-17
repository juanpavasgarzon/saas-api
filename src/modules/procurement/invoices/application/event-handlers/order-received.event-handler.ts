import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { OrderReceivedEvent } from '@modules/procurement/orders/domain/events/order-received.event';

import { CreateInvoiceCommand } from '../commands/create-invoice/create-invoice.command';

@EventsHandler(OrderReceivedEvent)
export class OrderReceivedEventHandler implements IEventHandler<OrderReceivedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: OrderReceivedEvent): Promise<void> {
    await this.commandBus.execute(
      new CreateInvoiceCommand(
        event.tenantId,
        `SI-${event.orderId.slice(0, 8).toUpperCase()}`,
        event.supplierId,
        event.orderId,
        event.total,
        null,
        'Auto-generated from received purchase order',
      ),
    );
  }
}
