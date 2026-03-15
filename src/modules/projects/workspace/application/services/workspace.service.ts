import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Workspace } from '../../domain/entities/workspace.entity';
import { GetWorkspaceQuery } from '../queries/get-workspace/get-workspace.query';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getWorkspaceById(id: string, tenantId: string): Promise<Workspace> {
    return this.queryBus.execute<GetWorkspaceQuery, Workspace>(new GetWorkspaceQuery(id, tenantId));
  }
}
