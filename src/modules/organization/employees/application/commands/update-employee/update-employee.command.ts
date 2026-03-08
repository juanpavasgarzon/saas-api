import { type ICommand } from '@nestjs/cqrs';

export class UpdateEmployeeCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly employeeId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly position: string,
    public readonly department: string,
    public readonly basicSalary: number,
  ) {}
}
