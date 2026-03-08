import { type ICommand } from '@nestjs/cqrs';

export class SendInvitationCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly email: string,
    public readonly role: string,
  ) {}
}
