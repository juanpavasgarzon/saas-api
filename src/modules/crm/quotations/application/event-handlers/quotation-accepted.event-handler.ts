import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { type IOutboxMessageRepository } from '@core/application/contracts/outbox-repository.contract';
import { QuotationAcceptedIntegrationEvent } from '@core/application/events/quotation-accepted.integration-event';
import { OUTBOX_REPOSITORY } from '@core/application/tokens/outbox-repository.token';
import { type ICustomerRepository } from '@modules/crm/customers/domain/contracts/customer-repository.contract';
import { Customer } from '@modules/crm/customers/domain/entities/customer.entity';
import { CUSTOMER_REPOSITORY } from '@modules/crm/customers/domain/tokens/customer-repository.token';
import { type IProspectRepository } from '@modules/crm/prospects/domain/contracts/prospect-repository.contract';
import { ProspectStatus } from '@modules/crm/prospects/domain/enums/prospect-status.enum';
import { PROSPECT_REPOSITORY } from '@modules/crm/prospects/domain/tokens/prospect-repository.token';

import { type IQuotationRepository } from '../../domain/contracts/quotation-repository.contract';
import { QuotationAcceptedEvent } from '../../domain/events/quotation-accepted.event';
import { QUOTATION_REPOSITORY } from '../../domain/tokens/quotation-repository.token';

@EventsHandler(QuotationAcceptedEvent)
export class QuotationAcceptedEventHandler implements IEventHandler<QuotationAcceptedEvent> {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: IOutboxMessageRepository,
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
  ) {}

  async handle(event: QuotationAcceptedEvent): Promise<void> {
    let customerId = event.customerId ?? '';

    if (event.prospectId) {
      const prospect = await this.prospectRepository.findById(event.prospectId, event.tenantId);
      let convertedCustomerId = '';
      if (prospect) {
        const email =
          prospect.email ?? `${prospect.name.toLowerCase().replace(/\s+/g, '.')}@unknown.com`;
        const existing = await this.customerRepository.findByEmail(email, event.tenantId);
        if (existing) {
          prospect.updateStatus(ProspectStatus.CONVERTED);
          await this.prospectRepository.save(prospect);
          convertedCustomerId = existing.id;
        } else {
          const customer = Customer.createFromProspect(
            event.prospectId,
            event.tenantId,
            prospect.name,
            email,
            prospect.phone ?? '',
            prospect.identificationNumber ?? '',
            prospect.address ?? '',
            prospect.company ?? null,
            prospect.contactPerson ?? null,
          );
          await this.customerRepository.save(customer);
          prospect.updateStatus(ProspectStatus.CONVERTED);
          await this.prospectRepository.save(prospect);
          convertedCustomerId = customer.id;
        }
      }
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
