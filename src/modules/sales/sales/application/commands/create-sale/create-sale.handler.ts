import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ISaleRepository } from '../../../domain/contracts/sale-repository.contract';
import { Sale } from '../../../domain/entities/sale.entity';
import { SALE_REPOSITORY } from '../../../domain/tokens/sale-repository.token';
import { CreateSaleCommand } from './create-sale.command';

@CommandHandler(CreateSaleCommand)
export class CreateSaleHandler implements ICommandHandler<CreateSaleCommand, string> {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(command: CreateSaleCommand): Promise<string> {
    const number = await this.saleRepository.nextNumber(command.tenantId);
    const sale = Sale.create(
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
