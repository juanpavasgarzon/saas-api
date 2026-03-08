import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { type ICompanyCreationService } from '@shared/application/contracts/company-creation.contract';
import { COMPANY_CREATION_SERVICE } from '@shared/application/tokens/company-creation.token';
import { UserRole } from '@shared/domain/enums/user-role.enum';
import { type IAuthUserService } from '@modules/identity/shared/contracts/auth-user-service.contract';
import { AUTH_USER_SERVICE } from '@modules/identity/shared/tokens/auth-user-service.token';

import { type RegisterResult } from '../../contracts/register.contract';
import { RegisterCommand } from './register.command';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand, RegisterResult> {
  constructor(
    @Inject(AUTH_USER_SERVICE)
    private readonly userService: IAuthUserService,
    @Inject(COMPANY_CREATION_SERVICE)
    private readonly companyCreationService: ICompanyCreationService,
  ) {}

  async execute(command: RegisterCommand): Promise<RegisterResult> {
    const companyId = await this.companyCreationService.createCompany(command.companyName);

    const userId = await this.userService.createUser(
      companyId,
      command.email,
      command.password,
      UserRole.OWNER,
    );

    return { companyId, userId };
  }
}
