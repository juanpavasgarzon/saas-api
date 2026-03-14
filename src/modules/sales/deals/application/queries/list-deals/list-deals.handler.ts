import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IDealRepository } from '../../../domain/contracts/deal-repository.contract';
import { type Deal } from '../../../domain/entities/deal.entity';
import { DEAL_REPOSITORY } from '../../../domain/tokens/deal-repository.token';
import { ListDealsQuery } from './list-deals.query';

@QueryHandler(ListDealsQuery)
export class ListSalesHandler implements IQueryHandler<ListDealsQuery, PaginatedResult<Deal>> {
  constructor(
    @Inject(DEAL_REPOSITORY)
    private readonly saleRepository: IDealRepository,
  ) {}

  async execute(query: ListDealsQuery): Promise<PaginatedResult<Deal>> {
    return this.saleRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
