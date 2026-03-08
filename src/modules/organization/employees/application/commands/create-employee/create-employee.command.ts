import { type ICommand } from '@nestjs/cqrs';

export class CreateEmployeeCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email: string,
    public readonly position: string,
    public readonly department: string,
    public readonly hiredAt: Date,
    public readonly basicSalary: number,
  ) {}
}
