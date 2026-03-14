import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IDealRepository } from '../../../domain/contracts/deal-repository.contract';
import { DealNotFoundError } from '../../../domain/errors/deal-not-found.error';
import { DEAL_REPOSITORY } from '../../../domain/tokens/deal-repository.token';
import { CancelDealCommand } from './cancel-deal.command';

@CommandHandler(CancelDealCommand)
export class CancelSaleHandler implements ICommandHandler<CancelDealCommand, void> {
  constructor(
    @Inject(DEAL_REPOSITORY)
    private readonly saleRepository: IDealRepository,
  ) {}

  async execute(command: CancelDealCommand): Promise<void> {
    const sale = await this.saleRepository.findById(command.id, command.tenantId);
    if (!sale) {
      throw new DealNotFoundError(command.id);
    }
    sale.cancel();
    await this.saleRepository.save(sale);
  }
}
