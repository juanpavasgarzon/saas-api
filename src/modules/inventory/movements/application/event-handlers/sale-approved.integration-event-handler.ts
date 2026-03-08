import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { SaleApprovedIntegrationEvent } from '@shared/application/events/sale-approved.integration-event';

import { MovementType } from '../../domain/enums/movement-type.enum';
import { RegisterMovementCommand } from '../commands/register-movement/register-movement.command';

@EventsHandler(SaleApprovedIntegrationEvent)
export class SaleApprovedIntegrationEventHandler implements IEventHandler<SaleApprovedIntegrationEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: SaleApprovedIntegrationEvent): Promise<void> {
    for (const item of event.items) {
      if (!item.productId) {
        continue;
      }

      const command = new RegisterMovementCommand(
        event.tenantId,
        item.productId,
        null,
        MovementType.EXIT,
        item.quantity,
        event.saleId,
        'Auto: sale approved',
      );
      await this.commandBus.execute(command);
    }
  }
}
