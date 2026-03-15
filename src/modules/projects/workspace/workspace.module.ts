import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddMemberHandler } from './application/commands/add-member/add-member.handler';
import { ChangeWorkspaceStatusHandler } from './application/commands/change-workspace-status/change-workspace-status.handler';
import { CreateWorkspaceHandler } from './application/commands/create-workspace/create-workspace.handler';
import { DeleteWorkspaceHandler } from './application/commands/delete-workspace/delete-workspace.handler';
import { RemoveMemberHandler } from './application/commands/remove-member/remove-member.handler';
import { UpdateWorkspaceHandler } from './application/commands/update-workspace/update-workspace.handler';
import { GetWorkspaceHandler } from './application/queries/get-workspace/get-workspace.handler';
import { ListWorkspacesHandler } from './application/queries/list-workspaces/list-workspaces.handler';
import { WorkspaceService } from './application/services/workspace.service';
import { WORKSPACE_REPOSITORY } from './domain/tokens/workspace-repository.token';
import { WorkspaceOrmEntity } from './infrastructure/entities/workspace.orm-entity';
import { WorkspaceMemberOrmEntity } from './infrastructure/entities/workspace-member.orm-entity';
import { WorkspaceTypeOrmRepository } from './infrastructure/repositories/workspace.typeorm-repository';
import { WorkspacesController } from './presentation/controllers/workspaces.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([WorkspaceOrmEntity, WorkspaceMemberOrmEntity])],
  controllers: [WorkspacesController],
  providers: [
    CreateWorkspaceHandler,
    UpdateWorkspaceHandler,
    DeleteWorkspaceHandler,
    ChangeWorkspaceStatusHandler,
    AddMemberHandler,
    RemoveMemberHandler,
    GetWorkspaceHandler,
    ListWorkspacesHandler,
    WorkspaceService,
    { provide: WORKSPACE_REPOSITORY, useClass: WorkspaceTypeOrmRepository },
  ],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
