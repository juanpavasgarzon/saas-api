import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IDealRepository } from '../../../domain/contracts/deal-repository.contract';
import { DealNotFoundError } from '../../../domain/errors/deal-not-found.error';
import { DEAL_REPOSITORY } from '../../../domain/tokens/deal-repository.token';
import { CancelDealCommand } from './cancel-deal.command';

@CommandHandler(CancelDealCommand)
export class CancelDealHandler implements ICommandHandler<CancelDealCommand, void> {
  constructor(
    @Inject(DEAL_REPOSITORY)
    private readonly dealRepository: IDealRepository,
  ) {}

  async execute(command: CancelDealCommand): Promise<void> {
    const deal = await this.dealRepository.findById(command.id, command.tenantId);
    if (!deal) {
      throw new DealNotFoundError(command.id);
    }
    deal.cancel();
    await this.dealRepository.save(deal);
  }
}
