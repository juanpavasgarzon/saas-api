import { type DealFilters } from '../../../domain/contracts/deal-filters.contract';

export class ListDealsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: DealFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
