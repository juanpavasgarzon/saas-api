import { type InvoiceStatus } from '../enums/invoice-status.enum';

export interface InvoiceFilters {
  status?: InvoiceStatus;
  supplierId?: string;
  orderId?: string;
}
