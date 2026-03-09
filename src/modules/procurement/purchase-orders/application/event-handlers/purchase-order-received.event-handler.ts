import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { PurchaseOrderReceivedIntegrationEvent } from '@shared/application/events/purchase-order-received.integration-event';
import { OUTBOX_REPOSITORY } from '@shared/application/tokens/outbox-repository.token';
import { type IOutboxMessageRepository } from '@shared/application/contracts/outbox-repository.contract';

import { PurchaseOrderReceivedEvent } from '../../domain/events/purchase-order-received.event';

@EventsHandler(PurchaseOrderReceivedEvent)
export class PurchaseOrderReceivedEventHandler implements IEventHandler<PurchaseOrderReceivedEvent> {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: IOutboxMessageRepository,
  ) {}

  async handle(event: PurchaseOrderReceivedEvent): Promise<void> {
    const integrationEvent = new PurchaseOrderReceivedIntegrationEvent(
      event.purchaseOrderId,
      event.tenantId,
      event.items,
    );
    await this.outbox.save(integrationEvent);
  }
}
