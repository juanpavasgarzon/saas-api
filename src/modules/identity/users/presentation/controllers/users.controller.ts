import {
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';
import { Permission } from '@core/domain/enums/permission.enum';
import { CurrentTenant } from '@core/presentation/decorators/current-tenant.decorator';
import { CurrentUser } from '@core/presentation/decorators/current-user.decorator';
import { RequirePermission } from '@core/presentation/decorators/require-permission.decorator';

import { DeactivateUserCommand } from '../../application/commands/deactivate-user/deactivate-user.command';
import { ReactivateUserCommand } from '../../application/commands/reactivate-user/reactivate-user.command';
import { GetUserQuery } from '../../application/queries/get-user/get-user.query';
import { ListUsersQuery } from '../../application/queries/list-users/list-users.query';
import { type User } from '../../domain/entities/user.entity';
import { UserResponseDto } from '../dtos/user-response.dto';

@ApiTags('Identity')
@ApiBearerAuth('JWT')
@Controller('identity/users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermission(Permission.IdentityAccountsRead)
  @ApiOperation({
    summary: 'List users',
    description: 'Returns all users for the current tenant. Owner only.',
  })
  @ApiOkResponse({ description: 'Paginated list of users' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listUsers(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<PaginatedResult<UserResponseDto>> {
    const query = new ListUsersQuery(tenantId, page, limit);
    const result = await this.queryBus.execute<ListUsersQuery, PaginatedResult<User>>(query);
    return {
      ...result,
      items: result.items.map((u) => new UserResponseDto(u)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.IdentityAccountsRead)
  @ApiOperation({ summary: 'Get user', description: 'Returns user data by ID.' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiOkResponse({ type: UserResponseDto })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    const getUserQuery = new GetUserQuery(id);
    const user = await this.queryBus.execute<GetUserQuery, User>(getUserQuery);
    return new UserResponseDto(user);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.IdentityAccountsRemove)
  @ApiOperation({ summary: 'Reactivate user', description: 'Reactivates a deactivated user.' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiNoContentResponse({ description: 'User reactivated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'User is already active' })
  async activateUser(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    const command = new ReactivateUserCommand(id);
    await this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.IdentityAccountsRemove)
  @ApiOperation({ summary: 'Deactivate user', description: 'Deactivates a user.' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiNoContentResponse({ description: 'User deactivated' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiConflictResponse({ description: 'User is already inactive' })
  async deactivateUser(
    @CurrentUser() requesterId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const deactivateUserCommand = new DeactivateUserCommand(id, requesterId);
    await this.commandBus.execute(deactivateUserCommand);
  }
}
