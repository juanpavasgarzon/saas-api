import { type ICommand } from '@nestjs/cqrs';

export class RegisterCommand implements ICommand {
  constructor(
    public readonly companyName: string,
    public readonly email: string,
    public readonly password: string,
  ) {}
}
