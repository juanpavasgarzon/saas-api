import { type IQuery } from '@nestjs/cqrs';

import { type EmployeeFilters } from '../../../domain/contracts/employee-filters.contract';

export class ListEmployeesQuery implements IQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: EmployeeFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
