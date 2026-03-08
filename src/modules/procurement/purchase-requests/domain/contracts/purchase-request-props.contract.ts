import { type PurchaseRequestStatus } from '../enums/purchase-request-status.enum';
import { type PurchaseRequestItemProps } from './purchase-request-item-props.contract';

export interface PurchaseRequestProps {
  id: string;
  tenantId: string;
  title: string;
  vendorId: string | null;
  vendorProspectId: string | null;
  status: PurchaseRequestStatus;
  notes: string | null;
  items: PurchaseRequestItemProps[];
  subtotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
