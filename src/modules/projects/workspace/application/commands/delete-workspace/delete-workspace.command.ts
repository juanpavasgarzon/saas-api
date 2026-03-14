import { type ICommand } from '@nestjs/cqrs';

export class DeleteProjectCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly projectId: string,
  ) {}
}
