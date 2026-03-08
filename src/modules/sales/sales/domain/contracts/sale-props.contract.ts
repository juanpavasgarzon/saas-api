import { type SaleStatus } from '../enums/sale-status.enum';
import { type SaleItemProps } from './sale-item-props.contract';

export interface SaleProps {
  id: string;
  tenantId: string;
  number: number;
  customerId: string;
  quotationId: string | null;
  status: SaleStatus;
  notes: string | null;
  subtotal: number;
  total: number;
  items: SaleItemProps[];
  createdAt: Date;
  updatedAt: Date;
}
