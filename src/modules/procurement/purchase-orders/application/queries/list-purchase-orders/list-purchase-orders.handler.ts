import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type IPurchaseOrderRepository } from '../../../domain/contracts/purchase-order-repository.contract';
import { type PurchaseOrder } from '../../../domain/entities/purchase-order.entity';
import { PURCHASE_ORDER_REPOSITORY } from '../../../domain/tokens/purchase-order-repository.token';
import { ListPurchaseOrdersQuery } from './list-purchase-orders.query';

@QueryHandler(ListPurchaseOrdersQuery)
export class ListPurchaseOrdersHandler implements IQueryHandler<
  ListPurchaseOrdersQuery,
  PaginatedResult<PurchaseOrder>
> {
  constructor(
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private readonly purchaseOrderRepository: IPurchaseOrderRepository,
  ) {}

  async execute(query: ListPurchaseOrdersQuery): Promise<PaginatedResult<PurchaseOrder>> {
    const filters = { status: query.status, vendorId: query.vendorId };
    return this.purchaseOrderRepository.findAll(query.tenantId, filters, query.page, query.limit);
  }
}
