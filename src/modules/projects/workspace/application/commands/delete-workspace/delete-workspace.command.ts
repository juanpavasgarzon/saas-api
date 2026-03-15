import { type ICommand } from '@nestjs/cqrs';

export class DeleteWorkspaceCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly projectId: string,
  ) {}
}
