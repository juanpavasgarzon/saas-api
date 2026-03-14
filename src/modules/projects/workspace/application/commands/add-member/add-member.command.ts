import { type ICommand } from '@nestjs/cqrs';

import { type ProjectMemberRole } from '../../../domain/enums/workspace-member-role.enum';

export class AddMemberCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly projectId: string,
    public readonly employeeId: string,
    public readonly role: ProjectMemberRole,
  ) {}
}
