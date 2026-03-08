import { type ICommand } from '@nestjs/cqrs';

export class DeactivateUserCommand implements ICommand {
  constructor(
    public readonly userId: string,
    public readonly requesterId: string,
  ) {}
}
