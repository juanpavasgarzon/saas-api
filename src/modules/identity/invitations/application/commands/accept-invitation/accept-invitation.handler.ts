import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IAuthUserService } from '@modules/identity/users/application/contracts/auth-user-service.contract';
import { AUTH_USER_SERVICE } from '@modules/identity/users/application/tokens/auth-user-service.token';

import { IInvitationRepository } from '../../../domain/contracts/invitation-repository.contract';
import { InvitationExpiredError } from '../../../domain/errors/invitation-expired.error';
import { InvitationNotFoundError } from '../../../domain/errors/invitation-not-found.error';
import { INVITATION_REPOSITORY } from '../../../domain/tokens/invitation-repository.token';
import { AcceptInvitationCommand } from './accept-invitation.command';

@CommandHandler(AcceptInvitationCommand)
export class AcceptInvitationHandler implements ICommandHandler<AcceptInvitationCommand, string> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: IInvitationRepository,
    @Inject(AUTH_USER_SERVICE)
    private readonly userService: IAuthUserService,
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

    const userId = await this.userService.createUser(
      invitation.tenantId,
      invitation.email,
      command.password,
      invitation.role,
    );

    invitation.accept();
    await this.invitationRepository.save(invitation);

    return userId;
  }
}
