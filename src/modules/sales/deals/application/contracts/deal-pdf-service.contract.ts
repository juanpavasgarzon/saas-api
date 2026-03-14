import { type Deal } from '../../domain/entities/deal.entity';

export interface IDealPdfService {
  generate(deal: Deal, companyName: string, companyLogo: string | null): Promise<Buffer>;
}
