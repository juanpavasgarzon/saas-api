import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { type IEmailService } from '../../../application/contracts/email-service.contract';
import { EMAIL_SERVICE } from '../../../application/tokens/email-service.token';
import { IInvitationRepository } from '../../../domain/contracts/invitation-repository.contract';
import { Invitation } from '../../../domain/entities/invitation.entity';
import { INVITATION_REPOSITORY } from '../../../domain/tokens/invitation-repository.token';
import { SendInvitationCommand } from './send-invitation.command';

@CommandHandler(SendInvitationCommand)
export class SendInvitationHandler implements ICommandHandler<SendInvitationCommand, string> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: IInvitationRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(command: SendInvitationCommand): Promise<string> {
    const invitation = Invitation.create(command.tenantId, command.email, command.role);

    await this.invitationRepository.save(invitation);
    await this.emailService.sendInvitation(invitation.email, invitation.token);

    return invitation.token;
  }
}
