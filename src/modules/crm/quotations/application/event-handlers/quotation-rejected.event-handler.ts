import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { type IOutboxMessageRepository } from '@core/application/contracts/outbox-repository.contract';
import { QuotationRejectedIntegrationEvent } from '@core/application/events/quotation-rejected.integration-event';
import { OUTBOX_REPOSITORY } from '@core/application/tokens/outbox-repository.token';

import { QuotationRejectedEvent } from '../../domain/events/quotation-rejected.event';

@EventsHandler(QuotationRejectedEvent)
export class QuotationRejectedEventHandler implements IEventHandler<QuotationRejectedEvent> {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: IOutboxMessageRepository,
  ) {}

  async handle(event: QuotationRejectedEvent): Promise<void> {
    const integrationEvent = new QuotationRejectedIntegrationEvent(
      event.quotationId,
      event.tenantId,
      event.items,
    );
    await this.outbox.save(integrationEvent);
  }
}
