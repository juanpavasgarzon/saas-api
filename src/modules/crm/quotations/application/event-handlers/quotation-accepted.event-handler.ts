import { Inject } from '@nestjs/common';
import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { type ICustomerRepository } from '@modules/crm/customers/domain/contracts/customer-repository.contract';
import { Customer } from '@modules/crm/customers/domain/entities/customer.entity';
import { CUSTOMER_REPOSITORY } from '@modules/crm/customers/domain/tokens/customer-repository.token';
import { type IProspectRepository } from '@modules/crm/prospects/domain/contracts/prospect-repository.contract';
import { ProspectStatus } from '@modules/crm/prospects/domain/enums/prospect-status.enum';
import { PROSPECT_REPOSITORY } from '@modules/crm/prospects/domain/tokens/prospect-repository.token';
import { ReserveStockCommand } from '@modules/inventory/stock/application/commands/reserve-stock/reserve-stock.command';
import { CreateDealFromQuotationCommand } from '@modules/sales/deals/application/commands/create-deal-from-quotation/create-deal-from-quotation.command';

import { type IQuotationRepository } from '../../domain/contracts/quotation-repository.contract';
import { QuotationAcceptedEvent } from '../../domain/events/quotation-accepted.event';
import { QUOTATION_REPOSITORY } from '../../domain/tokens/quotation-repository.token';

@EventsHandler(QuotationAcceptedEvent)
export class QuotationAcceptedEventHandler implements IEventHandler<QuotationAcceptedEvent> {
  constructor(
    private readonly commandBus: CommandBus,
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
        const name = prospect.name.toLowerCase().replace(/\s+/g, '.');
        const email = prospect.email ?? `${name}@unknown.com`;
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

    const createDealCommand = new CreateDealFromQuotationCommand(
      event.tenantId,
      event.quotationId,
      customerId,
      event.items,
    );
    await this.commandBus.execute(createDealCommand);

    for (const item of event.items) {
      if (item.itemType !== LineItemType.PRODUCT) {
        continue;
      }
      const reserveStock = new ReserveStockCommand(
        event.tenantId,
        item.itemId,
        item.quantity,
        event.quotationId,
      );
      await this.commandBus.execute(reserveStock);
    }
  }
}
