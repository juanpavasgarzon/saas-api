import { type IQuery } from '@nestjs/cqrs';

export class GetWorkspaceQuery implements IQuery {
  constructor(
    public readonly projectId: string,
    public readonly tenantId: string,
  ) {}
}
