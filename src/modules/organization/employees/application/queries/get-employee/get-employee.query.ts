import { type IQuery } from '@nestjs/cqrs';

export class GetEmployeeQuery implements IQuery {
  constructor(
    public readonly employeeId: string,
    public readonly tenantId: string,
  ) {}
}
