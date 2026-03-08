import { type AssetFilters } from '../../../domain/contracts/asset-filters.contract';

export class ListAssetsQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: AssetFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
