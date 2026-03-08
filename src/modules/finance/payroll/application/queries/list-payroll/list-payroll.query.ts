import { type IQuery } from '@nestjs/cqrs';

import { type PayrollFilters } from '../../../domain/contracts/payroll-repository.contract';

export class ListPayrollQuery implements IQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: PayrollFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
