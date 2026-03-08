import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type PurchaseOrder } from '../entities/purchase-order.entity';
import { type PurchaseOrderFilters } from './purchase-order-filters.contract';

export interface IPurchaseOrderRepository {
  findById(id: string, tenantId: string): Promise<PurchaseOrder | null>;
  findAll(
    tenantId: string,
    filters: PurchaseOrderFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PurchaseOrder>>;
  save(purchaseOrder: PurchaseOrder): Promise<void>;
}
