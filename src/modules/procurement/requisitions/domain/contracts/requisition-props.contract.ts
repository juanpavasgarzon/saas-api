import { type RequisitionStatus } from '../enums/requisition-status.enum';
import { type RequisitionItemProps } from './requisition-item-props.contract';

export interface RequisitionProps {
  id: string;
  tenantId: string;
  title: string;
  supplierId: string | null;
  supplierProspectId: string | null;
  status: RequisitionStatus;
  notes: string | null;
  items: RequisitionItemProps[];
  subtotal: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
