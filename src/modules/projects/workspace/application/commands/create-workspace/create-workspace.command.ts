import { type ICommand } from '@nestjs/cqrs';

import { type ProjectMemberRole } from '../../../domain/enums/workspace-member-role.enum';

export class CreateProjectCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly description: string,
    public readonly customerId: string,
    public readonly budget: number | null,
    public readonly startDate: Date | null,
    public readonly endDate: Date | null,
    public readonly members: Array<{ employeeId: string; role: ProjectMemberRole }>,
  ) {}
}
