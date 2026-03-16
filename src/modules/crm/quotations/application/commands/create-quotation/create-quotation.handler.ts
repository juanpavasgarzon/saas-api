import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ILineItemValidatorService } from '@core/application/contracts/line-item-validator.contract';
import { LINE_ITEM_VALIDATOR } from '@core/application/tokens/line-item-validator.token';
import { ConflictError } from '@core/domain/errors/conflict.error';
import { NotFoundError } from '@core/domain/errors/not-found.error';
import { type ICustomerRepository } from '@modules/crm/customers/domain/contracts/customer-repository.contract';
import { CUSTOMER_REPOSITORY } from '@modules/crm/customers/domain/tokens/customer-repository.token';
import { type IProspectRepository } from '@modules/crm/prospects/domain/contracts/prospect-repository.contract';
import { ProspectStatus } from '@modules/crm/prospects/domain/enums/prospect-status.enum';
import { PROSPECT_REPOSITORY } from '@modules/crm/prospects/domain/tokens/prospect-repository.token';

import { type IQuotationRepository } from '../../../domain/contracts/quotation-repository.contract';
import { Quotation } from '../../../domain/entities/quotation.entity';
import { QUOTATION_REPOSITORY } from '../../../domain/tokens/quotation-repository.token';
import { CreateQuotationCommand } from './create-quotation.command';

@CommandHandler(CreateQuotationCommand)
export class CreateQuotationHandler implements ICommandHandler<CreateQuotationCommand, string> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
    @Inject(LINE_ITEM_VALIDATOR)
    private readonly lineItemValidator: ILineItemValidatorService,
  ) {}

  async execute(command: CreateQuotationCommand): Promise<string> {
    if (command.prospectId) {
      const prospect = await this.prospectRepository.findById(command.prospectId, command.tenantId);
      const status = prospect?.status ?? null;
      if (status === ProspectStatus.QUALIFIED || status === ProspectStatus.CONVERTED) {
        throw new ConflictError(
          'Prospect has already been converted to a customer. Use customerId instead.',
        );
      }
    }

    if (command.customerId) {
      const customer = await this.customerRepository.findById(command.customerId, command.tenantId);
      if (!customer) {
        throw new NotFoundError('Customer', command.customerId);
      }

      if (!customer.isActive) {
        throw new ConflictError('Customer is inactive. Reactivate before creating a quotation.');
      }
    }

    await this.lineItemValidator.validate(command.items, command.tenantId);

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
