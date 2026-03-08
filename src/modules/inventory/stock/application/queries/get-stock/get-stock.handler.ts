import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { NotFoundError } from '@shared/domain/errors/not-found.error';

import { type IStockRepository } from '../../../domain/contracts/stock-repository.contract';
import { type Stock } from '../../../domain/entities/stock.entity';
import { STOCK_REPOSITORY } from '../../../domain/tokens/stock-repository.token';
import { GetStockQuery } from './get-stock.query';

@QueryHandler(GetStockQuery)
export class GetStockHandler implements IQueryHandler<GetStockQuery, Stock> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(query: GetStockQuery): Promise<Stock> {
    const stock = await this.stockRepository.findById(query.id, query.tenantId);
    if (!stock) {
      throw new NotFoundError('Stock', query.id);
    }
    return stock;
  }
}
