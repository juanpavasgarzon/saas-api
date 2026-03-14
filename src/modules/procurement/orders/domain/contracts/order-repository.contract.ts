import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type Order } from '../entities/order.entity';
import { type OrderFilters } from './order-filters.contract';

export interface IOrderRepository {
  findById(id: string, tenantId: string): Promise<Order | null>;
  findAll(
    tenantId: string,
    filters: OrderFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Order>>;
  save(order: Order): Promise<void>;
}
