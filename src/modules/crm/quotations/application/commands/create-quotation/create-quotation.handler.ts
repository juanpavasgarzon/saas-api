import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ConflictError } from '@shared/domain/errors/conflict.error';
import { type CustomerRepository } from '@modules/crm/customers/domain/contracts/customer-repository.contract';
import { CustomerNotFoundError } from '@modules/crm/customers/domain/errors/customer-not-found.error';
import { CUSTOMER_REPOSITORY } from '@modules/crm/customers/domain/tokens/customer-repository.token';
import { ProspectStatus } from '@modules/crm/prospects/domain/enums/prospect-status.enum';
import { type IProspectStatusService } from '@modules/crm/shared/contracts/prospect-status.contract';
import { PROSPECT_STATUS_SERVICE } from '@modules/crm/shared/tokens/prospect-status.token';

import { type IQuotationRepository } from '../../../domain/contracts/quotation-repository.contract';
import { Quotation } from '../../../domain/entities/quotation.entity';
import { QUOTATION_REPOSITORY } from '../../../domain/tokens/quotation-repository.token';
import { CreateQuotationCommand } from './create-quotation.command';

@CommandHandler(CreateQuotationCommand)
export class CreateQuotationHandler implements ICommandHandler<CreateQuotationCommand, string> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
    @Inject(PROSPECT_STATUS_SERVICE)
    private readonly prospectStatusService: IProspectStatusService,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: CreateQuotationCommand): Promise<string> {
    if (command.prospectId) {
      const status = await this.prospectStatusService.getStatus(
        command.prospectId,
        command.tenantId,
      );
      if (status === ProspectStatus.QUALIFIED || status === ProspectStatus.CONVERTED) {
        throw new ConflictError(
          'Prospect has already been converted to a customer. Use customerId instead.',
        );
      }
    }

    if (command.customerId) {
      const customer = await this.customerRepository.findById(command.customerId, command.tenantId);
      if (!customer) {
        throw new CustomerNotFoundError(command.customerId);
      }
      if (!customer.isActive) {
        throw new ConflictError('Customer is inactive. Reactivate before creating a quotation.');
      }
    }

    const number = await this.quotationRepository.nextNumber(command.tenantId);
    const quotation = Quotation.create(
      command.tenantId,
      number,
      command.title,
      command.customerId,
      command.prospectId,
      command.notes,
      command.validUntil,
      command.items,
    );
    await this.quotationRepository.save(quotation);
    return quotation.id;
  }
}
