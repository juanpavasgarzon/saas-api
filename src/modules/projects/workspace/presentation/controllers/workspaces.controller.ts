import {
  Body,
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
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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
import { RequirePermission } from '@core/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@core/presentation/dtos/created-response.dto';

import { ChangeWorkspaceStatusCommand } from '../../application/commands/change-workspace-status/change-workspace-status.command';
import { CreateWorkspaceCommand } from '../../application/commands/create-workspace/create-workspace.command';
import { DeleteWorkspaceCommand } from '../../application/commands/delete-workspace/delete-workspace.command';
import { UpdateWorkspaceCommand } from '../../application/commands/update-workspace/update-workspace.command';
import { GetWorkspaceQuery } from '../../application/queries/get-workspace/get-workspace.query';
import { ListWorkspacesQuery } from '../../application/queries/list-workspaces/list-workspaces.query';
import { type Workspace } from '../../domain/entities/workspace.entity';
import { ChangeWorkspaceStatusDto } from '../dtos/change-workspace-status.dto';
import { CreateWorkspaceDto } from '../dtos/create-workspace.dto';
import { UpdateWorkspaceDto } from '../dtos/update-workspace.dto';
import { WorkspaceResponseDto } from '../dtos/workspace-response.dto';

@ApiTags('Workspaces')
@ApiBearerAuth('JWT')
@Controller('workspaces')
export class WorkspacesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.ProjectsCreate)
  @ApiOperation({
    summary: 'Create workspace',
    description: 'Creates a workspace within the tenant.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createWorkspace(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateWorkspaceDto,
  ): Promise<CreatedResponseDto> {
    const createWorkspaceCommand = new CreateWorkspaceCommand(
      tenantId,
      dto.name,
      dto.description,
      dto.customerId,
      dto.budget ?? null,
      dto.startDate ? new Date(dto.startDate) : null,
      dto.endDate ? new Date(dto.endDate) : null,
      dto.members?.map((m) => ({ employeeId: m.employeeId, role: m.role })) ?? [],
    );
    const id = await this.commandBus.execute<CreateWorkspaceCommand, string>(
      createWorkspaceCommand,
    );
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.ProjectsRead)
  @ApiOperation({ summary: 'List workspaces', description: 'Returns workspaces with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of workspaces' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listWorkspaces(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<WorkspaceResponseDto>> {
    const filters = { customerId, status, search };
    const listWorkspacesQuery = new ListWorkspacesQuery(tenantId, filters, page, limit);
    const result = await this.queryBus.execute<ListWorkspacesQuery, PaginatedResult<Workspace>>(
      listWorkspacesQuery,
    );
    return {
      ...result,
      items: result.items.map((w) => new WorkspaceResponseDto(w)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProjectsRead)
  @ApiOperation({ summary: 'Get workspace', description: 'Returns a workspace with its members.' })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  @ApiOkResponse({ type: WorkspaceResponseDto })
  @ApiNotFoundResponse({ description: 'Workspace not found' })
  async getWorkspace(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WorkspaceResponseDto> {
    const getWorkspaceQuery = new GetWorkspaceQuery(id, tenantId);
    const workspace = await this.queryBus.execute<GetWorkspaceQuery, Workspace>(getWorkspaceQuery);
    return new WorkspaceResponseDto(workspace);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProjectsModify)
  @ApiOperation({ summary: 'Update workspace', description: 'Updates workspace details.' })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  @ApiNoContentResponse({ description: 'Workspace updated' })
  @ApiNotFoundResponse({ description: 'Workspace not found' })
  async updateWorkspace(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWorkspaceDto,
  ): Promise<void> {
    const updateWorkspaceCommand = new UpdateWorkspaceCommand(
      tenantId,
      id,
      dto.name,
      dto.description,
      dto.budget ?? null,
      dto.startDate ? new Date(dto.startDate) : null,
      dto.endDate ? new Date(dto.endDate) : null,
      dto.members?.map((m) => ({ employeeId: m.employeeId, role: m.role })) ?? null,
    );
    await this.commandBus.execute<UpdateWorkspaceCommand, void>(updateWorkspaceCommand);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProjectsModify)
  @ApiOperation({ summary: 'Change status', description: 'Transitions workspace status.' })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  @ApiNoContentResponse({ description: 'Status changed' })
  @ApiNotFoundResponse({ description: 'Workspace not found' })
  async changeStatus(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeWorkspaceStatusDto,
  ): Promise<void> {
    const changeWorkspaceStatusCommand = new ChangeWorkspaceStatusCommand(tenantId, id, dto.action);
    await this.commandBus.execute<ChangeWorkspaceStatusCommand, void>(changeWorkspaceStatusCommand);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProjectsRemove)
  @ApiOperation({
    summary: 'Delete workspace',
    description: 'Removes a workspace from the tenant.',
  })
  @ApiParam({ name: 'id', description: 'Workspace UUID' })
  @ApiNoContentResponse({ description: 'Workspace deleted' })
  @ApiNotFoundResponse({ description: 'Workspace not found' })
  async deleteWorkspace(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const deleteWorkspaceCommand = new DeleteWorkspaceCommand(tenantId, id);
    await this.commandBus.execute<DeleteWorkspaceCommand, void>(deleteWorkspaceCommand);
  }
}
