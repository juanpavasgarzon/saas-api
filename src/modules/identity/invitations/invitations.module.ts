import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailModule } from '@core/infrastructure/email/email.module';
import { UsersModule } from '@modules/identity/users/users.module';

import { AcceptInvitationHandler } from './application/commands/accept-invitation/accept-invitation.handler';
import { SendInvitationHandler } from './application/commands/send-invitation/send-invitation.handler';
import { ListInvitationsHandler } from './application/queries/list-invitations/list-invitations.handler';
import { INVITATION_REPOSITORY } from './domain/tokens/invitation-repository.token';
import { InvitationOrmEntity } from './infrastructure/entities/invitation.orm-entity';
import { InvitationTypeOrmRepository } from './infrastructure/repositories/invitation.typeorm-repository';
import { InvitationsController } from './presentation/controllers/invitations.controller';

@Module({
  imports: [CqrsModule, EmailModule, TypeOrmModule.forFeature([InvitationOrmEntity]), UsersModule],
  controllers: [InvitationsController],
  providers: [
    SendInvitationHandler,
    AcceptInvitationHandler,
    ListInvitationsHandler,
    { provide: INVITATION_REPOSITORY, useClass: InvitationTypeOrmRepository },
  ],
})
export class InvitationsModule {}
