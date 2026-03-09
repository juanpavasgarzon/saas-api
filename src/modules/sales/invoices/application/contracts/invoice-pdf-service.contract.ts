import { type Invoice } from '@modules/sales/invoices/domain/entities/invoice.entity';

export interface IInvoicePdfService {
  generate(invoice: Invoice, companyName: string, companyLogo: string | null): Promise<Buffer>;
}
