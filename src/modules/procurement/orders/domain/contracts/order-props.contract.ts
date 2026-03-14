import { type OrderStatus } from '../enums/order-status.enum';
import { type OrderItemProps } from './order-item-props.contract';

export interface OrderProps {
  id: string;
  tenantId: string;
  requisitionId: string;
  supplierId: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  items: OrderItemProps[];
  createdAt: Date;
  updatedAt: Date;
}
