import { EventBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { PurchaseOrderReceivedIntegrationEvent } from '@shared/application/events/purchase-order-received.integration-event';

import { PurchaseOrderReceivedEvent } from '../../domain/events/purchase-order-received.event';

@EventsHandler(PurchaseOrderReceivedEvent)
export class PurchaseOrderReceivedEventHandler implements IEventHandler<PurchaseOrderReceivedEvent> {
  constructor(private readonly eventBus: EventBus) {}

  handle(event: PurchaseOrderReceivedEvent): void {
    this.eventBus.publish(
      new PurchaseOrderReceivedIntegrationEvent(event.purchaseOrderId, event.tenantId, event.items),
    );
  }
}
