import { type IQuery } from '@nestjs/cqrs';

export class SearchCustomersQuery implements IQuery {
  constructor(
    public readonly tenantId: string,
    public readonly search: string,
    public readonly limit: number,
  ) {}
}
