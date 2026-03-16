import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ILineItemValidatorService } from '@core/application/contracts/line-item-validator.contract';
import { LINE_ITEM_VALIDATOR } from '@core/application/tokens/line-item-validator.token';

import { type IDealRepository } from '../../../domain/contracts/deal-repository.contract';
import { Deal } from '../../../domain/entities/deal.entity';
import { DEAL_REPOSITORY } from '../../../domain/tokens/deal-repository.token';
import { CreateDealCommand } from './create-deal.command';

@CommandHandler(CreateDealCommand)
export class CreateDealHandler implements ICommandHandler<CreateDealCommand, string> {
  constructor(
    @Inject(DEAL_REPOSITORY)
    private readonly dealRepository: IDealRepository,
    @Inject(LINE_ITEM_VALIDATOR)
    private readonly lineItemValidator: ILineItemValidatorService,
  ) {}

  async execute(command: CreateDealCommand): Promise<string> {
    await this.lineItemValidator.validate(command.items, command.tenantId);

    const number = await this.dealRepository.nextNumber(command.tenantId);
    const deal = Deal.create(
      command.tenantId,
      number,
      command.customerId,
      null,
      command.notes,
      command.items,
    );
    await this.dealRepository.save(deal);
    return deal.id;
  }
}
