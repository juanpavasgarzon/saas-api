import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { PurchaseOrderReceivedIntegrationEvent } from '@shared/application/events/purchase-order-received.integration-event';

import { MovementSource } from '../../domain/enums/movement-source.enum';
import { MovementType } from '../../domain/enums/movement-type.enum';
import { RegisterMovementCommand } from '../commands/register-movement/register-movement.command';

@EventsHandler(PurchaseOrderReceivedIntegrationEvent)
export class PurchaseOrderReceivedIntegrationEventHandler implements IEventHandler<PurchaseOrderReceivedIntegrationEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: PurchaseOrderReceivedIntegrationEvent): Promise<void> {
    for (const item of event.items) {
      if (!item.productId) {
        continue;
      }

      const command = new RegisterMovementCommand(
        event.tenantId,
        item.productId,
        null,
        null,
        MovementType.ENTRY,
        item.quantity,
        MovementSource.PURCHASE,
        event.purchaseOrderId,
        'Auto: purchase order received',
      );
      await this.commandBus.execute(command);
    }
  }
}
