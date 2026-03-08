import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type ISaleRepository } from '../../../domain/contracts/sale-repository.contract';
import { type Sale } from '../../../domain/entities/sale.entity';
import { SaleNotFoundError } from '../../../domain/errors/sale-not-found.error';
import { SALE_REPOSITORY } from '../../../domain/tokens/sale-repository.token';
import { GetSaleQuery } from './get-sale.query';

@QueryHandler(GetSaleQuery)
export class GetSaleHandler implements IQueryHandler<GetSaleQuery, Sale> {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(query: GetSaleQuery): Promise<Sale> {
    const sale = await this.saleRepository.findById(query.id, query.tenantId);
    if (!sale) {
      throw new SaleNotFoundError();
    }
    return sale;
  }
}
