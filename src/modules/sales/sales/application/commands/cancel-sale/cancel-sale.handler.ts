import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ISaleRepository } from '../../../domain/contracts/sale-repository.contract';
import { SaleNotFoundError } from '../../../domain/errors/sale-not-found.error';
import { SALE_REPOSITORY } from '../../../domain/tokens/sale-repository.token';
import { CancelSaleCommand } from './cancel-sale.command';

@CommandHandler(CancelSaleCommand)
export class CancelSaleHandler implements ICommandHandler<CancelSaleCommand, void> {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(command: CancelSaleCommand): Promise<void> {
    const sale = await this.saleRepository.findById(command.id, command.tenantId);
    if (!sale) {
      throw new SaleNotFoundError();
    }
    sale.cancel();
    await this.saleRepository.save(sale);
  }
}
