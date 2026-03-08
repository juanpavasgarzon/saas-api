import { type QuotationFilters } from '../../../domain/contracts/quotation-filters.contract';

export class ListQuotationsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: QuotationFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
