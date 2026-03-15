import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IEmailService } from '@core/application/contracts/email-service.contract';
import { EMAIL_SERVICE } from '@core/application/tokens/email-service.token';
import { InvitationNotFoundError } from '@modules/identity/invitations/domain/errors/invitation-not-found.error';

import { IInvitationRepository } from '../../../domain/contracts/invitation-repository.contract';
import { INVITATION_REPOSITORY } from '../../../domain/tokens/invitation-repository.token';
import { ResendInvitationCommand } from './resend-invitation.command';

@CommandHandler(ResendInvitationCommand)
export class ResendInvitationHandler implements ICommandHandler<ResendInvitationCommand, string> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: IInvitationRepository,
    @Inject(EMAIL_SERVICE)
    private readonly emailService: IEmailService,
  ) {}

  async execute(command: ResendInvitationCommand): Promise<string> {
    const invitation = await this.invitationRepository.findById(
      command.invitationId,
      command.tenantId,
    );
    if (!invitation) {
      throw new InvitationNotFoundError(command.invitationId);
    }

    invitation.resend();
    await this.invitationRepository.save(invitation);

    const linkUrl = `${invitation.url}?token=${invitation.token}`;
    await this.emailService.sendMail({
      to: invitation.email,
      subject: 'Your invitation has been resent',
      text: [
        'Your invitation to join the platform has been resent.',
        '',
        'To accept the invitation and set up your account, click the following link:',
        '',
        linkUrl,
        '',
        `This invitation will expire on ${invitation.expiresAt.toDateString()}.`,
        '',
        'If you did not expect this invitation, you can safely ignore this email.',
      ].join('\n'),
    });

    return invitation.token;
  }
}
