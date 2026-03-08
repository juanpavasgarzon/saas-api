import { type ICommand } from '@nestjs/cqrs';

export class CreateCompanyCommand implements ICommand {
  constructor(
    public readonly name: string,
    public readonly ownerEmail: string,
    public readonly ownerPasswordHash: string,
  ) {}
}
