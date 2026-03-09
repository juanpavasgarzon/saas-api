import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IEmailService } from '@shared/application/contracts/email-service.contract';
import { EMAIL_SERVICE } from '@shared/application/tokens/email-service.token';

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

    await this.emailService.sendMail({
      to: invitation.email,
      subject: 'You have been invited',
      text: [
        'You have been invited to join the platform.',
        '',
        'To accept the invitation and set up your account, Unlock with the following token:',
        '',
        invitation.token,
        '',
        'This invitation will expire in 7 days.',
        '',
        'If you did not expect this invitation, you can safely ignore this email.',
      ].join('\n'),
    });

    return invitation.token;
  }
}
