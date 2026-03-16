import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Service } from '../entities/service.entity';

export interface ServiceFilters {
  search?: string;
  isActive?: boolean;
}

export interface IServiceRepository {
  findById(id: string, tenantId: string): Promise<Service | null>;
  findAll(
    tenantId: string,
    filters: ServiceFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Service>>;
  findExistingIds(ids: string[], tenantId: string): Promise<string[]>;
  save(service: Service): Promise<void>;
}
