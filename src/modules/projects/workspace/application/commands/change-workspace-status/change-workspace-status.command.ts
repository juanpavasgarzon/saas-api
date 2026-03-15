import { type ICommand } from '@nestjs/cqrs';

export type WorkspaceStatusAction = 'activate' | 'hold' | 'complete' | 'cancel';

export class ChangeWorkspaceStatusCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly projectId: string,
    public readonly action: WorkspaceStatusAction,
  ) {}
}
