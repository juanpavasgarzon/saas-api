import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';
import { Permission } from '@core/domain/enums/permission.enum';
import { CurrentTenant } from '@core/presentation/decorators/current-tenant.decorator';
import { Public } from '@core/presentation/decorators/public.decorator';
import { RequirePermission } from '@core/presentation/decorators/require-permission.decorator';

import { AcceptInvitationCommand } from '../../application/commands/accept-invitation/accept-invitation.command';
import { SendInvitationCommand } from '../../application/commands/send-invitation/send-invitation.command';
import { ListInvitationsQuery } from '../../application/queries/list-invitations/list-invitations.query';
import { Invitation } from '../../domain/entities/invitation.entity';
import { AcceptInvitationDto } from '../dtos/accept-invitation.dto';
import { AcceptInvitationResponseDto } from '../dtos/accept-invitation-response.dto';
import { InvitationResponseDto } from '../dtos/invitation-response.dto';
import { InvitationTokenResponseDto } from '../dtos/invitation-token-response.dto';
import { SendInvitationDto } from '../dtos/send-invitation.dto';

@ApiTags('Identity')
@ApiBearerAuth('JWT')
@Controller('identity/invitations')
export class InvitationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermission(Permission.IdentityAccountsRead)
  @ApiOperation({
    summary: 'List invitations',
    description: 'Returns all pending invitations for the current tenant. Owner only.',
  })
  @ApiOkResponse({ description: 'Paginated list of invitations' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listInvitations(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<PaginatedResult<InvitationResponseDto>> {
    const listInvitationsQuery = new ListInvitationsQuery(tenantId, page, limit);
    const result = await this.queryBus.execute<ListInvitationsQuery, PaginatedResult<Invitation>>(
      listInvitationsQuery,
    );
    return {
      ...result,
      items: result.items.map((invitation) => new InvitationResponseDto(invitation)),
    };
  }

  @Post()
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
