import { type ProspectFilters } from '../../../domain/contracts/prospect-filters.contract';

export class ListProspectsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: ProspectFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
