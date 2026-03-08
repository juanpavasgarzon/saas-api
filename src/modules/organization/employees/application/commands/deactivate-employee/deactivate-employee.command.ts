import { type ICommand } from '@nestjs/cqrs';

export class DeactivateEmployeeCommand implements ICommand {
  constructor(
    public readonly employeeId: string,
    public readonly tenantId: string,
  ) {}
}
