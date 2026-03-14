import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Warehouse } from '../entities/warehouse.entity';

export interface WarehouseFilters {
  search?: string;
  isActive?: boolean;
}

export interface IWarehouseRepository {
  findById(id: string, tenantId: string): Promise<Warehouse | null>;
  findAll(
    tenantId: string,
    filters: WarehouseFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Warehouse>>;
  save(warehouse: Warehouse): Promise<void>;
}
