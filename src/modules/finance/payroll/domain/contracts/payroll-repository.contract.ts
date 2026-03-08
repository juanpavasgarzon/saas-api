import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type PayrollEntry } from '../entities/payroll-entry.entity';

export interface PayrollFilters {
  employeeId?: string;
  period?: string;
  status?: string;
}

export interface IPayrollRepository {
  findById(id: string, tenantId: string): Promise<PayrollEntry | null>;
  findAll(
    tenantId: string,
    filters: PayrollFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PayrollEntry>>;
  save(entry: PayrollEntry): Promise<void>;
}
