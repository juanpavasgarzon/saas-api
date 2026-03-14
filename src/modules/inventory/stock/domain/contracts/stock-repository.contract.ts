import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Stock } from '../entities/stock.entity';

export interface StockFilters {
  productId?: string;
  warehouseId?: string;
}

export interface IStockRepository {
  findById(id: string, tenantId: string): Promise<Stock | null>;
  findByProductAndWarehouse(
    productId: string,
    warehouseId: string,
    tenantId: string,
  ): Promise<Stock | null>;
  findAllByProduct(productId: string, tenantId: string): Promise<Stock[]>;
  findAll(
    tenantId: string,
    filters: StockFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Stock>>;
  save(stock: Stock): Promise<void>;
}
