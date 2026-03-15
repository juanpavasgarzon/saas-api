import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IDealRepository } from '../../../domain/contracts/deal-repository.contract';
import { Deal } from '../../../domain/entities/deal.entity';
import { DEAL_REPOSITORY } from '../../../domain/tokens/deal-repository.token';
import { CreateDealFromQuotationCommand } from './create-deal-from-quotation.command';

@CommandHandler(CreateDealFromQuotationCommand)
export class CreateDealFromQuotationHandler implements ICommandHandler<
  CreateDealFromQuotationCommand,
  string
> {
  constructor(
    @Inject(DEAL_REPOSITORY)
    private readonly dealRepository: IDealRepository,
  ) {}

  async execute(command: CreateDealFromQuotationCommand): Promise<string> {
    const number = await this.dealRepository.nextNumber(command.tenantId);
    const deal = Deal.create(
      command.tenantId,
      number,
      command.customerId,
      command.quotationId,
      null,
      command.items.map((i) => ({
        itemType: i.itemType,
        itemId: i.itemId,
        description: i.description,
        quantity: i.quantity,
        unit: i.unit,
        unitPrice: i.unitPrice,
      })),
    );
    await this.dealRepository.save(deal);
    return deal.id;
  }
}
