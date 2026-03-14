import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { type IOutboxMessageRepository } from '@core/application/contracts/outbox-repository.contract';
import { DealApprovedIntegrationEvent } from '@core/application/events/deal-approved.integration-event';
import { OUTBOX_REPOSITORY } from '@core/application/tokens/outbox-repository.token';

import { DealApprovedEvent } from '../../domain/events/deal-approved.event';

@EventsHandler(DealApprovedEvent)
export class DealApprovedEventHandler implements IEventHandler<DealApprovedEvent> {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: IOutboxMessageRepository,
  ) {}

  async handle(event: DealApprovedEvent): Promise<void> {
    const integrationEvent = new DealApprovedIntegrationEvent(
      event.dealId,
      event.tenantId,
      event.customerId,
      event.items.map((i) => ({
        itemType: i.itemType,
        itemId: i.itemId,
        description: i.description,
        quantity: i.quantity,
        unit: i.unit,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal,
      })),
    );
    await this.outbox.save(integrationEvent);
  }
}
