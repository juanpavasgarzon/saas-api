import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { OrderReceivedEvent } from '@modules/procurement/orders/domain/events/order-received.event';

import { MovementSource } from '../../domain/enums/movement-source.enum';
import { MovementType } from '../../domain/enums/movement-type.enum';
import { RegisterMovementCommand } from '../commands/register-movement/register-movement.command';

@EventsHandler(OrderReceivedEvent)
export class OrderReceivedEventHandler implements IEventHandler<OrderReceivedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: OrderReceivedEvent): Promise<void> {
    for (const item of event.items) {
      if (item.itemType !== LineItemType.PRODUCT) {
        continue;
      }
      await this.commandBus.execute(
        new RegisterMovementCommand(
          event.tenantId,
          item.itemId,
          null,
          null,
          MovementType.ENTRY,
          item.quantity,
          MovementSource.PURCHASE,
          event.orderId,
          'Auto: purchase order received',
        ),
      );
    }
  }
}
