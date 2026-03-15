import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { type IDealRepository } from '../../../domain/contracts/deal-repository.contract';
import { DealNotFoundError } from '../../../domain/errors/deal-not-found.error';
import { DEAL_REPOSITORY } from '../../../domain/tokens/deal-repository.token';
import { ApproveDealCommand } from './approve-deal.command';

@CommandHandler(ApproveDealCommand)
export class ApproveDealHandler implements ICommandHandler<ApproveDealCommand, void> {
  constructor(
    @Inject(DEAL_REPOSITORY)
    private readonly dealRepository: IDealRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ApproveDealCommand): Promise<void> {
    const deal = await this.dealRepository.findById(command.id, command.tenantId);
    if (!deal) {
      throw new DealNotFoundError(command.id);
    }

    this.publisher.mergeObjectContext(deal);
    deal.approve();
    await this.dealRepository.save(deal);
    deal.commit();
  }
}
