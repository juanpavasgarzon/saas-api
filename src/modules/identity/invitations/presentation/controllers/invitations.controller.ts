import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { Public } from '@shared/presentation/decorators/public.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';

import { AcceptInvitationCommand } from '../../application/commands/accept-invitation/accept-invitation.command';
import { SendInvitationCommand } from '../../application/commands/send-invitation/send-invitation.command';
import { AcceptInvitationDto } from '../dtos/accept-invitation.dto';
import { AcceptInvitationResponseDto } from '../dtos/accept-invitation-response.dto';
import { InvitationTokenResponseDto } from '../dtos/invitation-token-response.dto';
import { SendInvitationDto } from '../dtos/send-invitation.dto';

@ApiTags('Identity')
@Controller('identity/invitations')
export class InvitationsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiBearerAuth('JWT')
  @RequirePermission(Permission.IdentityAccountsCreate)
  @ApiOperation({ summary: 'Send invitation', description: 'Sends an invitation.' })
  @ApiCreatedResponse({ type: InvitationTokenResponseDto })
  async sendInvitation(
    @CurrentTenant() tenantId: string,
    @Body() dto: SendInvitationDto,
  ): Promise<InvitationTokenResponseDto> {
    const sendInvitationCommand = new SendInvitationCommand(tenantId, dto.email, dto.role);
    const token = await this.commandBus.execute<SendInvitationCommand, string>(
      sendInvitationCommand,
    );
    return new InvitationTokenResponseDto(token);
  }

  @Post(':token/accept')
  @Public()
  @ApiOperation({
    summary: 'Accept invitation',
    description: 'Creates account from invitation token. No authentication required.',
  })
  @ApiParam({ name: 'token', description: 'Invitation token received by email' })
  @ApiCreatedResponse({ type: AcceptInvitationResponseDto })
  @ApiNotFoundResponse({ description: 'Invalid or expired token' })
  async acceptInvitation(
    @Param('token') token: string,
    @Body() dto: AcceptInvitationDto,
  ): Promise<AcceptInvitationResponseDto> {
    const acceptInvitationCommand = new AcceptInvitationCommand(token, dto.password);
    const userId = await this.commandBus.execute<AcceptInvitationCommand, string>(
      acceptInvitationCommand,
    );
    return new AcceptInvitationResponseDto(userId);
  }
}
