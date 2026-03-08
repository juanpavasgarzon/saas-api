import { type QuotationStatus } from '../enums/quotation-status.enum';
import { type QuotationItemProps } from './quotation-item-props.contract';

export interface QuotationProps {
  id: string;
  tenantId: string;
  number: number;
  title: string;
  customerId: string | null;
  prospectId: string | null;
  status: QuotationStatus;
  notes: string | null;
  validUntil: Date | null;
  subtotal: number;
  total: number;
  items: QuotationItemProps[];
  createdAt: Date;
  updatedAt: Date;
}
