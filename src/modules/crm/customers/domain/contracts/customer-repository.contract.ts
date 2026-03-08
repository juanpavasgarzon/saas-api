import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type Customer } from '../entities/customer.entity';
import { type CustomerFilters } from './customer-filters.contract';

export interface CustomerRepository {
  findById(id: string, tenantId: string): Promise<Customer | null>;
  findByEmail(email: string, tenantId: string): Promise<Customer | null>;
  findAll(
    tenantId: string,
    filters: CustomerFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Customer>>;
  save(customer: Customer): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
  existsByEmail(email: string, tenantId: string): Promise<boolean>;
}
