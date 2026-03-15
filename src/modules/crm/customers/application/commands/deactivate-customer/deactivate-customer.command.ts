import { type ICommand } from '@nestjs/cqrs';

export class DeactivateCustomerCommand implements ICommand {
  constructor(
    public readonly customerId: string,
    public readonly tenantId: string,
  ) {}
}
