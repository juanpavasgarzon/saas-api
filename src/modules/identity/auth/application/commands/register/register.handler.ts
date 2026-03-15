import { Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { type ICompanyCreationService } from '@core/application/contracts/company-creation.contract';
import { COMPANY_CREATION_SERVICE } from '@core/application/tokens/company-creation.token';
import { UserRole } from '@core/domain/enums/user-role.enum';
import { CreateUserCommand } from '@modules/identity/users/application/commands/create-user/create-user.command';

import { type RegisterResult } from '../../contracts/register.contract';
import { RegisterCommand } from './register.command';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand, RegisterResult> {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(COMPANY_CREATION_SERVICE)
    private readonly companyCreationService: ICompanyCreationService,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResult> {
    const companyId = await this.companyCreationService.createCompany(command.companyName);

    const userId = await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(companyId, command.email, command.password, UserRole.OWNER),
    );

    return { companyId, userId };
  }
}
