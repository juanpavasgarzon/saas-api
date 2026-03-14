import { type ICommand } from '@nestjs/cqrs';

export class CreateCustomerCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly name: string,
    public readonly email: string,
    public readonly phone: string,
    public readonly company: string | null,
    public readonly identificationNumber: string,
    public readonly address: string,
    public readonly contactPerson: string | null,
  ) {}
}
