import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { type ISaleRepository } from '../../../domain/contracts/sale-repository.contract';
import { SaleNotFoundError } from '../../../domain/errors/sale-not-found.error';
import { SALE_REPOSITORY } from '../../../domain/tokens/sale-repository.token';
import { ApproveSaleCommand } from './approve-sale.command';

@CommandHandler(ApproveSaleCommand)
export class ApproveSaleHandler implements ICommandHandler<ApproveSaleCommand, void> {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ApproveSaleCommand): Promise<void> {
    const sale = await this.saleRepository.findById(command.id, command.tenantId);
    if (!sale) {
      throw new SaleNotFoundError();
    }

    this.publisher.mergeObjectContext(sale);
    sale.approve();
    await this.saleRepository.save(sale);
    sale.commit();
  }
}
