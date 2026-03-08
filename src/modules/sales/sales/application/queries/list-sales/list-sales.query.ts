import { type SaleFilters } from '../../../domain/contracts/sale-filters.contract';

export class ListSalesQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: SaleFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
