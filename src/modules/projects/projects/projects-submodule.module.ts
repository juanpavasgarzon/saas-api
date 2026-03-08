import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddMemberHandler } from './application/commands/add-member/add-member.handler';
import { ChangeProjectStatusHandler } from './application/commands/change-project-status/change-project-status.handler';
import { CreateProjectHandler } from './application/commands/create-project/create-project.handler';
import { DeleteProjectHandler } from './application/commands/delete-project/delete-project.handler';
import { RemoveMemberHandler } from './application/commands/remove-member/remove-member.handler';
import { UpdateProjectHandler } from './application/commands/update-project/update-project.handler';
import { GetProjectHandler } from './application/queries/get-project/get-project.handler';
import { ListProjectsHandler } from './application/queries/list-projects/list-projects.handler';
import { ProjectService } from './application/services/project.service';
import { PROJECT_REPOSITORY } from './domain/tokens/project-repository.token';
import { ProjectOrmEntity } from './infrastructure/entities/project.orm-entity';
import { ProjectMemberOrmEntity } from './infrastructure/entities/project-member.orm-entity';
import { ProjectTypeOrmRepository } from './infrastructure/repositories/project.typeorm-repository';
import { ProjectsController } from './presentation/controllers/projects.controller';

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
export class ProjectsSubmoduleModule {}
