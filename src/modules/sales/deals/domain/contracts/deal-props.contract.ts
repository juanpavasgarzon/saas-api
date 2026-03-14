import { type DealStatus } from '../enums/deal-status.enum';
import { type DealItemProps } from './deal-item-props.contract';

export interface DealProps {
  id: string;
  tenantId: string;
  number: number;
  customerId: string;
  quotationId: string | null;
  status: DealStatus;
  notes: string | null;
  subtotal: number;
  total: number;
  items: DealItemProps[];
  createdAt: Date;
  updatedAt: Date;
}
