import { type IQuery } from '@nestjs/cqrs';

export class ListInvitationsQuery implements IQuery {
  constructor(
    public readonly tenantId: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
