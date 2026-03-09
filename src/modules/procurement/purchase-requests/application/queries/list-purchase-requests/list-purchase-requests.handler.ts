import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type IPurchaseRequestRepository } from '../../../domain/contracts/purchase-request-repository.contract';
import { type PurchaseRequest } from '../../../domain/entities/purchase-request.entity';
import { PURCHASE_REQUEST_REPOSITORY } from '../../../domain/tokens/purchase-request-repository.token';
import { ListPurchaseRequestsQuery } from './list-purchase-requests.query';

@QueryHandler(ListPurchaseRequestsQuery)
export class ListPurchaseRequestsHandler implements IQueryHandler<
  ListPurchaseRequestsQuery,
  PaginatedResult<PurchaseRequest>
> {
  constructor(
    @Inject(PURCHASE_REQUEST_REPOSITORY)
    private readonly purchaseRequestRepository: IPurchaseRequestRepository,
  ) {}

  async execute(query: ListPurchaseRequestsQuery): Promise<PaginatedResult<PurchaseRequest>> {
    const filters = { status: query.status, vendorId: query.vendorId };
    return this.purchaseRequestRepository.findAll(query.tenantId, filters, query.page, query.limit);
  }
}
