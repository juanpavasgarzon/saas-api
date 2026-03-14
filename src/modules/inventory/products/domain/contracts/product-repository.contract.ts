import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Product } from '../entities/product.entity';

export interface ProductFilters {
  search?: string;
  isActive?: boolean;
}

export interface IProductRepository {
  findById(id: string, tenantId: string): Promise<Product | null>;
  findAll(
    tenantId: string,
    filters: ProductFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Product>>;
  existsBySku(sku: string, tenantId: string): Promise<boolean>;
  save(product: Product): Promise<void>;
}
