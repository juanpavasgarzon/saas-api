import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type Employee } from '../entities/employee.entity';
import { type EmployeeFilters } from './employee-filters.contract';

export interface IEmployeeRepository {
  findById(id: string, tenantId: string): Promise<Employee | null>;
  findByEmail(email: string, tenantId: string): Promise<Employee | null>;
  findAll(
    tenantId: string,
    filters: EmployeeFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Employee>>;
  save(employee: Employee): Promise<void>;
  delete(id: string, tenantId: string): Promise<void>;
  existsByEmail(email: string, tenantId: string): Promise<boolean>;
}
