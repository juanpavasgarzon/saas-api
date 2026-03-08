import { type PurchaseOrderStatus } from '../enums/purchase-order-status.enum';

export interface PurchaseOrderFilters {
  status?: PurchaseOrderStatus;
  vendorId?: string;
}
