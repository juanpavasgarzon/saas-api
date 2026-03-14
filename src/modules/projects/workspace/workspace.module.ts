import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddMemberHandler } from './application/commands/add-member/add-member.handler';
import { ChangeProjectStatusHandler } from './application/commands/change-workspace-status/change-workspace-status.handler';
import { CreateProjectHandler } from './application/commands/create-workspace/create-workspace.handler';
import { DeleteProjectHandler } from './application/commands/delete-workspace/delete-workspace.handler';
import { RemoveMemberHandler } from './application/commands/remove-member/remove-member.handler';
import { UpdateProjectHandler } from './application/commands/update-workspace/update-workspace.handler';
import { GetProjectHandler } from './application/queries/get-workspace/get-workspace.handler';
import { ListProjectsHandler } from './application/queries/list-workspaces/list-workspaces.handler';
import { ProjectService } from './application/services/workspace.service';
import { PROJECT_REPOSITORY } from './domain/tokens/workspace-repository.token';
import { ProjectOrmEntity } from './infrastructure/entities/workspace.orm-entity';
import { ProjectMemberOrmEntity } from './infrastructure/entities/workspace-member.orm-entity';
import { ProjectTypeOrmRepository } from './infrastructure/repositories/workspace.typeorm-repository';
import { ProjectsController } from './presentation/controllers/workspaces.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProjectOrmEntity, ProjectMemberOrmEntity])],
  controllers: [ProjectsController],
  providers: [
    CreateProjectHandler,
    UpdateProjectHandler,
    DeleteProjectHandler,
    ChangeProjectStatusHandler,
    AddMemberHandler,
    RemoveMemberHandler,
    GetProjectHandler,
    ListProjectsHandler,
    ProjectService,
    { provide: PROJECT_REPOSITORY, useClass: ProjectTypeOrmRepository },
  ],
  exports: [ProjectService],
})
export class WorkspaceModule {}
