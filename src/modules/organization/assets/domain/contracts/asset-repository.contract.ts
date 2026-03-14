import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Asset } from '../entities/asset.entity';
import { type AssetFilters } from './asset-filters.contract';

export interface IAssetRepository {
  findById(id: string, tenantId: string): Promise<Asset | null>;
  findAll(
    tenantId: string,
    filters: AssetFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Asset>>;
  nextNumber(tenantId: string): Promise<number>;
  save(asset: Asset): Promise<void>;
}
