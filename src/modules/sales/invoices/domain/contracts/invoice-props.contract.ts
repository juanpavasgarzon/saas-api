import { type InvoiceStatus } from '../enums/invoice-status.enum';
import { type InvoiceItemProps } from './invoice-item-props.contract';

export interface InvoiceProps {
  id: string;
  tenantId: string;
  number: number;
  dealId: string;
  customerId: string;
  status: InvoiceStatus;
  notes: string | null;
  subtotal: number;
  total: number;
  sentAt: Date | null;
  paidAt: Date | null;
  items: InvoiceItemProps[];
  createdAt: Date;
  updatedAt: Date;
}
