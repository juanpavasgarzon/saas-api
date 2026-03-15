import { type ICommand } from '@nestjs/cqrs';

import { type WorkspaceMemberRole } from '../../../domain/enums/workspace-member-role.enum';

export class UpdateWorkspaceCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly projectId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly budget: number | null,
    public readonly startDate: Date | null,
    public readonly endDate: Date | null,
    public readonly members: Array<{ employeeId: string; role: WorkspaceMemberRole }> | null,
  ) {}
}
