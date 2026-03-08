import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ISaleRepository } from '../../../domain/contracts/sale-repository.contract';
import { Sale } from '../../../domain/entities/sale.entity';
import { SALE_REPOSITORY } from '../../../domain/tokens/sale-repository.token';
import { CreateSaleFromQuotationCommand } from './create-sale-from-quotation.command';

@CommandHandler(CreateSaleFromQuotationCommand)
export class CreateSaleFromQuotationHandler implements ICommandHandler<
  CreateSaleFromQuotationCommand,
  string
> {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(command: CreateSaleFromQuotationCommand): Promise<string> {
    const number = await this.saleRepository.nextNumber(command.tenantId);
    const sale = Sale.create(
      command.tenantId,
      number,
      command.customerId,
      command.quotationId,
      null,
      command.items,
    );
    await this.saleRepository.save(sale);
    return sale.id;
  }
}
