import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IDealRepository } from '../../../domain/contracts/deal-repository.contract';
import { Deal } from '../../../domain/entities/deal.entity';
import { DEAL_REPOSITORY } from '../../../domain/tokens/deal-repository.token';
import { CreateDealCommand } from './create-deal.command';

@CommandHandler(CreateDealCommand)
export class CreateSaleHandler implements ICommandHandler<CreateDealCommand, string> {
  constructor(
    @Inject(DEAL_REPOSITORY)
    private readonly saleRepository: IDealRepository,
  ) {}

  async execute(command: CreateDealCommand): Promise<string> {
    const number = await this.saleRepository.nextNumber(command.tenantId);
    const sale = Deal.create(
      command.tenantId,
      number,
      command.customerId,
      null,
      command.notes,
      command.items,
    );
    await this.saleRepository.save(sale);
    return sale.id;
  }
}
