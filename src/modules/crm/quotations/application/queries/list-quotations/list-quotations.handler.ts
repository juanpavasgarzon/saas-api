import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type IQuotationRepository } from '../../../domain/contracts/quotation-repository.contract';
import { type Quotation } from '../../../domain/entities/quotation.entity';
import { QUOTATION_REPOSITORY } from '../../../domain/tokens/quotation-repository.token';
import { ListQuotationsQuery } from './list-quotations.query';

@QueryHandler(ListQuotationsQuery)
export class ListQuotationsHandler implements IQueryHandler<
  ListQuotationsQuery,
  PaginatedResult<Quotation>
> {
  constructor(
    @Inject(QUOTATION_REPOSITORY)
    private readonly quotationRepository: IQuotationRepository,
  ) {}

  async execute(query: ListQuotationsQuery): Promise<PaginatedResult<Quotation>> {
    return this.quotationRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
