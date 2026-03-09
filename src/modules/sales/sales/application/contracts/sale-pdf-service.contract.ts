import { type Sale } from '@modules/sales/sales/domain/entities/sale.entity';

export interface ISalePdfService {
  generate(sale: Sale, companyName: string, companyLogo: string | null): Promise<Buffer>;
}
