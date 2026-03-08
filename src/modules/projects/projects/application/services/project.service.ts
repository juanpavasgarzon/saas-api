import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Project } from '../../domain/entities/project.entity';
import { GetProjectQuery } from '../queries/get-project/get-project.query';

@Injectable()
export class ProjectService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getProjectById(id: string, tenantId: string): Promise<Project> {
    return this.queryBus.execute<GetProjectQuery, Project>(new GetProjectQuery(id, tenantId));
  }
}
