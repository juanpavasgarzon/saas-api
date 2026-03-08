import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type ISaleRepository } from '../../../domain/contracts/sale-repository.contract';
import { type Sale } from '../../../domain/entities/sale.entity';
import { SALE_REPOSITORY } from '../../../domain/tokens/sale-repository.token';
import { ListSalesQuery } from './list-sales.query';

@QueryHandler(ListSalesQuery)
export class ListSalesHandler implements IQueryHandler<ListSalesQuery, PaginatedResult<Sale>> {
  constructor(
    @Inject(SALE_REPOSITORY)
    private readonly saleRepository: ISaleRepository,
  ) {}

  async execute(query: ListSalesQuery): Promise<PaginatedResult<Sale>> {
    return this.saleRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
