import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

import { type WorkspaceStatusAction } from '../../application/commands/change-workspace-status/change-workspace-status.command';

export class ChangeWorkspaceStatusDto {
  @ApiProperty({
    enum: ['activate', 'hold', 'complete', 'cancel'],
    description: 'Status transition action to apply to the project',
  })
  @IsIn(['activate', 'hold', 'complete', 'cancel'])
  action!: WorkspaceStatusAction;
}
