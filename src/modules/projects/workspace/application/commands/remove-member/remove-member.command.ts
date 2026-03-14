import { type ICommand } from '@nestjs/cqrs';

export class RemoveMemberCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly projectId: string,
    public readonly employeeId: string,
  ) {}
}
