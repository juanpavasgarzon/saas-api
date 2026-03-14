import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { type IOutboxMessageRepository } from '@core/application/contracts/outbox-repository.contract';
import { QuotationExpiredIntegrationEvent } from '@core/application/events/quotation-expired.integration-event';
import { OUTBOX_REPOSITORY } from '@core/application/tokens/outbox-repository.token';

import { QuotationExpiredEvent } from '../../domain/events/quotation-expired.event';

@EventsHandler(QuotationExpiredEvent)
export class QuotationExpiredEventHandler implements IEventHandler<QuotationExpiredEvent> {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: IOutboxMessageRepository,
  ) {}

  async handle(event: QuotationExpiredEvent): Promise<void> {
    const integrationEvent = new QuotationExpiredIntegrationEvent(
      event.quotationId,
      event.tenantId,
      event.items,
    );
    await this.outbox.save(integrationEvent);
  }
}
