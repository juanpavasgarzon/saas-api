import { type Invoice } from '../../domain/entities/invoice.entity';

export interface IInvoicePdfService {
  generate(invoice: Invoice, companyName: string, companyLogo: string | null): Promise<Buffer>;
}
