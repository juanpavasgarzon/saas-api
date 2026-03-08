import { type IQuery } from '@nestjs/cqrs';

import { type CustomerFilters } from '../../../domain/contracts/customer-filters.contract';

export class ListCustomersQuery implements IQuery {
  constructor(
    public readonly tenantId: string,
    public readonly filters: CustomerFilters,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
