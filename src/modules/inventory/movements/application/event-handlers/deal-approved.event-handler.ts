import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { DealApprovedEvent } from '@modules/sales/deals/domain/events/deal-approved.event';

import { MovementSource } from '../../domain/enums/movement-source.enum';
import { MovementType } from '../../domain/enums/movement-type.enum';
import { RegisterMovementCommand } from '../commands/register-movement/register-movement.command';

@EventsHandler(DealApprovedEvent)
export class DealApprovedEventHandler implements IEventHandler<DealApprovedEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: DealApprovedEvent): Promise<void> {
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
          MovementType.EXIT,
          item.quantity,
          MovementSource.SALE,
          event.dealId,
          null,
        ),
      );
    }
  }
}
