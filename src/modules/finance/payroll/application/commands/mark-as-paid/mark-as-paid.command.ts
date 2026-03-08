import { type ICommand } from '@nestjs/cqrs';

export class MarkAsPaidCommand implements ICommand {
  constructor(
    public readonly entryId: string,
    public readonly tenantId: string,
  ) {}
}
