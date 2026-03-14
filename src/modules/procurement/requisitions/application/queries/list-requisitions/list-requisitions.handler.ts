import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IRequisitionRepository } from '../../../domain/contracts/requisition-repository.contract';
import { type Requisition } from '../../../domain/entities/requisition.entity';
import { REQUISITION_REPOSITORY } from '../../../domain/tokens/requisition-repository.token';
import { ListRequisitionsQuery } from './list-requisitions.query';

@QueryHandler(ListRequisitionsQuery)
export class ListRequisitionsHandler implements IQueryHandler<
  ListRequisitionsQuery,
  PaginatedResult<Requisition>
> {
  constructor(
    @Inject(REQUISITION_REPOSITORY)
    private readonly requisitionRepository: IRequisitionRepository,
  ) {}

  async execute(query: ListRequisitionsQuery): Promise<PaginatedResult<Requisition>> {
    const filters = { status: query.status, supplierId: query.supplierId };
    return this.requisitionRepository.findAll(query.tenantId, filters, query.page, query.limit);
  }
}
