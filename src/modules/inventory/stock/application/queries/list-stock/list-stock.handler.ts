import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IStockRepository } from '../../../domain/contracts/stock-repository.contract';
import { type Stock } from '../../../domain/entities/stock.entity';
import { STOCK_REPOSITORY } from '../../../domain/tokens/stock-repository.token';
import { ListStockQuery } from './list-stock.query';

@QueryHandler(ListStockQuery)
export class ListStockHandler implements IQueryHandler<ListStockQuery, PaginatedResult<Stock>> {
  constructor(
    @Inject(STOCK_REPOSITORY)
    private readonly stockRepository: IStockRepository,
  ) {}

  async execute(query: ListStockQuery): Promise<PaginatedResult<Stock>> {
    return this.stockRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
