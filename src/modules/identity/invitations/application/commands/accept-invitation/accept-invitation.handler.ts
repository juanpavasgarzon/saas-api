import { Inject } from '@nestjs/common';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRole } from '@core/domain/enums/user-role.enum';
import { CreateUserCommand } from '@modules/identity/users/application/commands/create-user/create-user.command';

import { IInvitationRepository } from '../../../domain/contracts/invitation-repository.contract';
import { InvitationExpiredError } from '../../../domain/errors/invitation-expired.error';
import { InvitationNotFoundError } from '../../../domain/errors/invitation-not-found.error';
import { INVITATION_REPOSITORY } from '../../../domain/tokens/invitation-repository.token';
import { AcceptInvitationCommand } from './accept-invitation.command';

@CommandHandler(AcceptInvitationCommand)
export class AcceptInvitationHandler implements ICommandHandler<AcceptInvitationCommand, string> {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: IInvitationRepository,
  ) {}

  async execute(command: AcceptInvitationCommand): Promise<string> {
    const invitation = await this.invitationRepository.findByToken(command.token);
    if (!invitation) {
      throw new InvitationNotFoundError(command.token);
    }

    if (invitation.isExpired()) {
      invitation.expire();
      await this.invitationRepository.save(invitation);
      throw new InvitationExpiredError();
    }

    const userId = await this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(
        invitation.tenantId,
        invitation.email,
        command.password,
        invitation.role as UserRole,
      ),
    );

    invitation.accept();
    await this.invitationRepository.save(invitation);

    return userId;
  }
}
