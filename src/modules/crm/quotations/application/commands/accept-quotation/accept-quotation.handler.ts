import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { type IQuotationRepository } from '../../../domain/contracts/quotation-repository.contract';
import { QuotationNotFoundError } from '../../../domain/errors/quotation-not-found.error';
import { QUOTATION_REPOSITORY } from '../../../domain/tokens/quotation-repository.token';
import { AcceptQuotationCommand } from './accept-quotation.command';

@CommandHandler(AcceptQuotationCommand)
export class AcceptQuotationHandler implements ICommandHandler<AcceptQuotationCommand, void> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: AcceptQuotationCommand): Promise<void> {
    const quotation = await this.quotationRepository.findById(command.id, command.tenantId);
    if (!quotation) {
      throw new QuotationNotFoundError();
    }

    this.publisher.mergeObjectContext(quotation);
    quotation.accept();
    await this.quotationRepository.save(quotation);
    quotation.commit();
  }
}
