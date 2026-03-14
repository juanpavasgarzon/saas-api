import { type SaleFilters } from '../../../domain/contracts/deal-filters.contract';

export class ListDealsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: SaleFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
