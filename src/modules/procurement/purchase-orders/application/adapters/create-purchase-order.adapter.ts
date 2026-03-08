import { Inject, Injectable } from '@nestjs/common';

import { type IPurchaseOrderRepository } from '@modules/procurement/purchase-orders/domain/contracts/purchase-order-repository.contract';
import { PurchaseOrder } from '@modules/procurement/purchase-orders/domain/entities/purchase-order.entity';
import { PURCHASE_ORDER_REPOSITORY } from '@modules/procurement/purchase-orders/domain/tokens/purchase-order-repository.token';
import { type ICreatePurchaseOrderService } from '@modules/procurement/shared/contracts/create-purchase-order.contract';

@Injectable()
export class CreatePurchaseOrderAdapter implements ICreatePurchaseOrderService {
  constructor(
    @Inject(PURCHASE_ORDER_REPOSITORY)
    private readonly purchaseOrderRepository: IPurchaseOrderRepository,
  ) {}

  async createFromRequest(
    tenantId: string,
    purchaseRequestId: string,
    vendorId: string,
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>,
  ): Promise<void> {
    const purchaseOrder = PurchaseOrder.create(tenantId, purchaseRequestId, vendorId, items);
    await this.purchaseOrderRepository.save(purchaseOrder);
  }
}
