import { type Quotation } from '../../domain/entities/quotation.entity';

export interface IQuotationPdfService {
  generate(quotation: Quotation, companyName: string, companyLogo: string | null): Promise<Buffer>;
}
