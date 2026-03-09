import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { type IOutboxMessageRepository } from '@shared/application/contracts/outbox-repository.contract';
import { QuotationAcceptedIntegrationEvent } from '@shared/application/events/quotation-accepted.integration-event';
import { OUTBOX_REPOSITORY } from '@shared/application/tokens/outbox-repository.token';
import { type IProspectToCustomerService } from '@modules/crm/shared/contracts/prospect-to-customer.contract';
import { PROSPECT_TO_CUSTOMER_SERVICE } from '@modules/crm/shared/tokens/prospect-to-customer.token';

import { type IQuotationRepository } from '../../domain/contracts/quotation-repository.contract';
import { QuotationAcceptedEvent } from '../../domain/events/quotation-accepted.event';
import { QUOTATION_REPOSITORY } from '../../domain/tokens/quotation-repository.token';

@EventsHandler(QuotationAcceptedEvent)
export class QuotationAcceptedEventHandler implements IEventHandler<QuotationAcceptedEvent> {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: IOutboxMessageRepository,
    @Inject(PROSPECT_TO_CUSTOMER_SERVICE)
    private readonly prospectToCustomer: IProspectToCustomerService,
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
  ) {}

  async handle(event: QuotationAcceptedEvent): Promise<void> {
    let customerId = event.customerId ?? '';

    if (event.prospectId) {
      const convertedCustomerId = await this.prospectToCustomer.convert(
        event.prospectId,
        event.tenantId,
      );
      if (convertedCustomerId) {
        customerId = convertedCustomerId;
        const quotation = await this.quotationRepository.findById(
          event.quotationId,
          event.tenantId,
        );
        if (quotation) {
          quotation.assignCustomer(customerId);
          await this.quotationRepository.save(quotation);
        }
      }
    }

    if (!customerId) {
      return;
    }

    const integrationEvent = new QuotationAcceptedIntegrationEvent(
      event.quotationId,
      event.tenantId,
      customerId,
      event.items,
    );
    await this.outbox.save(integrationEvent);
  }
}
