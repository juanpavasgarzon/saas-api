import { type ICommand } from '@nestjs/cqrs';

import { UserRole } from '../../../domain/enums/user-role.enum';

export class CreateUserCommand implements ICommand {
  constructor(
    public readonly tenantId: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole = UserRole.USER,
  ) {}
}
