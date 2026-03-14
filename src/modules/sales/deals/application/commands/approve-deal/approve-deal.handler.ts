import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { type IDealRepository } from '../../../domain/contracts/deal-repository.contract';
import { DealNotFoundError } from '../../../domain/errors/deal-not-found.error';
import { DEAL_REPOSITORY } from '../../../domain/tokens/deal-repository.token';
import { ApproveDealCommand } from './approve-deal.command';

@CommandHandler(ApproveDealCommand)
export class ApproveSaleHandler implements ICommandHandler<ApproveDealCommand, void> {
  constructor(
    @Inject(DEAL_REPOSITORY)
    private readonly saleRepository: IDealRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ApproveDealCommand): Promise<void> {
    const sale = await this.saleRepository.findById(command.id, command.tenantId);
    if (!sale) {
      throw new DealNotFoundError(command.id);
    }

    this.publisher.mergeObjectContext(sale);
    sale.approve();
    await this.saleRepository.save(sale);
    sale.commit();
  }
}
