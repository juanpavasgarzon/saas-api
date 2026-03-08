import { type InvoiceFilters } from '../../../domain/contracts/invoice-filters.contract';

export class ListInvoicesQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: InvoiceFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
