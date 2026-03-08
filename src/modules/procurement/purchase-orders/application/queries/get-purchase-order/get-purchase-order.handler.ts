import { Inject } from '@nestjs/common';
import { type IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IPurchaseOrderRepository } from '../../../domain/contracts/purchase-order-repository.contract';
import { type PurchaseOrder } from '../../../domain/entities/purchase-order.entity';
import { PurchaseOrderNotFoundError } from '../../../domain/errors/purchase-order-not-found.error';
import { PURCHASE_ORDER_REPOSITORY } from '../../../domain/tokens/purchase-order-repository.token';
import { GetPurchaseOrderQuery } from './get-purchase-order.query';

@QueryHandler(GetPurchaseOrderQuery)
export class GetPurchaseOrderHandler implements IQueryHandler<
  GetPurchaseOrderQuery,
  PurchaseOrder
> {
  constructor(
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private readonly purchaseOrderRepository: IPurchaseOrderRepository,
  ) {}

  async execute(query: GetPurchaseOrderQuery): Promise<PurchaseOrder> {
    const po = await this.purchaseOrderRepository.findById(query.id, query.tenantId);
    if (!po) {
      throw new PurchaseOrderNotFoundError();
    }
    return po;
  }
}
