import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { SaleApprovedIntegrationEvent } from '@shared/application/events/sale-approved.integration-event';
import { OUTBOX_REPOSITORY } from '@shared/application/tokens/outbox-repository.token';
import { type IOutboxMessageRepository } from '@shared/domain/contracts/outbox-repository.contract';

import { SaleApprovedEvent } from '../../domain/events/sale-approved.event';

@EventsHandler(SaleApprovedEvent)
export class SaleApprovedEventHandler implements IEventHandler<SaleApprovedEvent> {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: IOutboxMessageRepository,
  ) {}

  async handle(event: SaleApprovedEvent): Promise<void> {
    const integrationEvent = new SaleApprovedIntegrationEvent(
      event.saleId,
      event.tenantId,
      event.customerId,
      event.items.map((i) => ({
        productId: null,
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
