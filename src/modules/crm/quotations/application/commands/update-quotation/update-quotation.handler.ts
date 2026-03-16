import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ILineItemValidatorService } from '@core/application/contracts/line-item-validator.contract';
import { LINE_ITEM_VALIDATOR } from '@core/application/tokens/line-item-validator.token';

import { type IQuotationRepository } from '../../../domain/contracts/quotation-repository.contract';
import { QuotationNotFoundError } from '../../../domain/errors/quotation-not-found.error';
import { QUOTATION_REPOSITORY } from '../../../domain/tokens/quotation-repository.token';
import { UpdateQuotationCommand } from './update-quotation.command';

@CommandHandler(UpdateQuotationCommand)
export class UpdateQuotationHandler implements ICommandHandler<UpdateQuotationCommand, void> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
    @Inject(LINE_ITEM_VALIDATOR)
    private readonly lineItemValidator: ILineItemValidatorService,
  ) {}

  async execute(command: UpdateQuotationCommand): Promise<void> {
    const quotation = await this.quotationRepository.findById(command.id, command.tenantId);
    if (!quotation) {
      throw new QuotationNotFoundError(command.id);
    }

    await this.lineItemValidator.validate(command.items, command.tenantId);

    quotation.update(command.title, command.notes, command.validUntil, command.items);
    await this.quotationRepository.save(quotation);
  }
}
