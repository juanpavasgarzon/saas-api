import { type InvoiceStatus } from '../enums/invoice-status.enum';

export interface InvoiceProps {
  id: string;
  tenantId: string;
  number: number;
  invoiceNumber: string;
  supplierId: string;
  orderId: string;
  amount: number;
  dueDate: Date | null;
  status: InvoiceStatus;
  notes: string | null;
  paidAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
