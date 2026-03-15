import { Inject } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { ICustomerRepository } from '@modules/crm/customers/domain/contracts/customer-repository.contract';
import { Customer } from '@modules/crm/customers/domain/entities/customer.entity';
import { CUSTOMER_REPOSITORY } from '@modules/crm/customers/domain/tokens/customer-repository.token';

import { ProspectConvertedEvent } from '../../domain/events/prospect.converted';

@EventsHandler(ProspectConvertedEvent)
export class ProspectConvertedEventHandler implements IEventHandler<ProspectConvertedEvent> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async handle(event: ProspectConvertedEvent): Promise<void> {
    const name = event.name.toLowerCase().replace(/\s+/g, '.');
    const email = event.email ?? `${name}@unknown.com`;

    const existing = await this.customerRepository.findByEmail(email, event.tenantId);
    if (existing) {
      return;
    }

    const customer = Customer.createFromProspect(
      event.prospectId,
      event.tenantId,
      event.name,
      email,
      event.phone ?? '',
      event.identificationNumber ?? '',
      event.address ?? '',
      event.company ?? null,
      event.contactPerson ?? null,
    );

    await this.customerRepository.save(customer);
  }
}
