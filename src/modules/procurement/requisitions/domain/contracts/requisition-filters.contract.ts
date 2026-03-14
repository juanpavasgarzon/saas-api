import { type RequisitionStatus } from '../enums/requisition-status.enum';

export interface RequisitionFilters {
  status?: RequisitionStatus;
  supplierId?: string;
}
