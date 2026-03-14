import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IQuotationRepository } from '../../../domain/contracts/quotation-repository.contract';
import { QuotationNotFoundError } from '../../../domain/errors/quotation-not-found.error';
import { QUOTATION_REPOSITORY } from '../../../domain/tokens/quotation-repository.token';
import { UpdateQuotationCommand } from './update-quotation.command';

@CommandHandler(UpdateQuotationCommand)
export class UpdateQuotationHandler implements ICommandHandler<UpdateQuotationCommand, void> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
  ) {}

  async execute(command: UpdateQuotationCommand): Promise<void> {
    const quotation = await this.quotationRepository.findById(command.id, command.tenantId);
    if (!quotation) {
      throw new QuotationNotFoundError(command.id);
    }

    quotation.update(command.title, command.notes, command.validUntil, command.items);
    await this.quotationRepository.save(quotation);
  }
}
