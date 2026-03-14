import { Inject, Injectable } from '@nestjs/common';

import { type ICustomerRepository } from '@modules/crm/customers/domain/contracts/customer-repository.contract';
import { Customer } from '@modules/crm/customers/domain/entities/customer.entity';
import { CUSTOMER_REPOSITORY } from '@modules/crm/customers/domain/tokens/customer-repository.token';
import { type IProspectRepository } from '@modules/crm/prospects/domain/contracts/prospect-repository.contract';
import { ProspectStatus } from '@modules/crm/prospects/domain/enums/prospect-status.enum';
import { PROSPECT_REPOSITORY } from '@modules/crm/prospects/domain/tokens/prospect-repository.token';
import { type IProspectToCustomerService } from '@modules/crm/shared/contracts/prospect-to-customer.contract';

@Injectable()
export class ProspectToCustomerAdapter implements IProspectToCustomerService {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async convert(prospectId: string, tenantId: string): Promise<string> {
    const prospect = await this.prospectRepository.findById(prospectId, tenantId);
    if (!prospect) {
      return '';
    }

    const email =
      prospect.email ?? `${prospect.name.toLowerCase().replace(/\s+/g, '.')}@unknown.com`;
    const existing = await this.customerRepository.findByEmail(email, tenantId);
    if (existing) {
      prospect.updateStatus(ProspectStatus.CONVERTED);
      await this.prospectRepository.save(prospect);
      return existing.id;
    }

    const customer = Customer.createFromProspect(
      prospectId,
      tenantId,
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

    return customer.id;
  }
}
