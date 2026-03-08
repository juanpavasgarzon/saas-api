import { type PurchaseOrderStatus } from '../enums/purchase-order-status.enum';
import { type PurchaseOrderItemProps } from './purchase-order-item-props.contract';

export interface PurchaseOrderProps {
  id: string;
  tenantId: string;
  purchaseRequestId: string;
  vendorId: string;
  status: PurchaseOrderStatus;
  subtotal: number;
  total: number;
  items: PurchaseOrderItemProps[];
  createdAt: Date;
  updatedAt: Date;
}
