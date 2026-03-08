import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IQuotationRepository } from '../../../domain/contracts/quotation-repository.contract';
import { QuotationNotFoundError } from '../../../domain/errors/quotation-not-found.error';
import { QUOTATION_REPOSITORY } from '../../../domain/tokens/quotation-repository.token';
import { ExpireQuotationCommand } from './expire-quotation.command';

@CommandHandler(ExpireQuotationCommand)
export class ExpireQuotationHandler implements ICommandHandler<ExpireQuotationCommand, void> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
  ) {}

  async execute(command: ExpireQuotationCommand): Promise<void> {
    const quotation = await this.quotationRepository.findById(command.id, command.tenantId);
    if (!quotation) {
      throw new QuotationNotFoundError();
    }

    quotation.expire();
    await this.quotationRepository.save(quotation);
  }
}
