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

import { ChangeProjectStatusCommand } from '../../application/commands/change-workspace-status/change-workspace-status.command';
import { CreateProjectCommand } from '../../application/commands/create-workspace/create-workspace.command';
import { DeleteProjectCommand } from '../../application/commands/delete-workspace/delete-workspace.command';
import { UpdateProjectCommand } from '../../application/commands/update-workspace/update-workspace.command';
import { GetProjectQuery } from '../../application/queries/get-workspace/get-workspace.query';
import { ListProjectsQuery } from '../../application/queries/list-workspaces/list-workspaces.query';
import { type Project } from '../../domain/entities/workspace.entity';
import { ChangeProjectStatusDto } from '../dtos/change-workspace-status.dto';
import { CreateProjectDto } from '../dtos/create-workspace.dto';
import { UpdateProjectDto } from '../dtos/update-workspace.dto';
import { ProjectResponseDto } from '../dtos/workspace-response.dto';

@ApiTags('Projects')
@ApiBearerAuth('JWT')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.ProjectsCreate)
  @ApiOperation({ summary: 'Create project', description: 'Creates a project within the tenant.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createProject(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateProjectDto,
  ): Promise<CreatedResponseDto> {
    const createProjectCommand = new CreateProjectCommand(
      tenantId,
      dto.name,
      dto.description,
      dto.customerId,
      dto.budget ?? null,
      dto.startDate ? new Date(dto.startDate) : null,
      dto.endDate ? new Date(dto.endDate) : null,
      dto.members?.map((m) => ({ employeeId: m.employeeId, role: m.role })) ?? [],
    );
    const id = await this.commandBus.execute<CreateProjectCommand, string>(createProjectCommand);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.ProjectsRead)
  @ApiOperation({ summary: 'List projects', description: 'Returns projects with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of projects' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'],
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listProjects(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<ProjectResponseDto>> {
    const filters = { customerId, status, search };
    const listProjectsQuery = new ListProjectsQuery(tenantId, filters, page, limit);
    const result = await this.queryBus.execute<ListProjectsQuery, PaginatedResult<Project>>(
      listProjectsQuery,
    );
    return {
      ...result,
      items: result.items.map((p) => new ProjectResponseDto(p)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProjectsRead)
  @ApiOperation({ summary: 'Get project', description: 'Returns a project with its members.' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiOkResponse({ type: ProjectResponseDto })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async getProject(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProjectResponseDto> {
    const getProjectQuery = new GetProjectQuery(id, tenantId);
    const project = await this.queryBus.execute<GetProjectQuery, Project>(getProjectQuery);
    return new ProjectResponseDto(project);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProjectsModify)
  @ApiOperation({ summary: 'Update project', description: 'Updates project details.' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiNoContentResponse({ description: 'Project updated' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async updateProject(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<void> {
    const updateProjectCommand = new UpdateProjectCommand(
      tenantId,
      id,
      dto.name,
      dto.description,
      dto.budget ?? null,
      dto.startDate ? new Date(dto.startDate) : null,
      dto.endDate ? new Date(dto.endDate) : null,
      dto.members?.map((m) => ({ employeeId: m.employeeId, role: m.role })) ?? null,
    );
    await this.commandBus.execute<UpdateProjectCommand, void>(updateProjectCommand);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProjectsModify)
  @ApiOperation({ summary: 'Change status', description: 'Transitions project status.' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiNoContentResponse({ description: 'Status changed' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async changeStatus(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeProjectStatusDto,
  ): Promise<void> {
    const changeProjectStatusCommand = new ChangeProjectStatusCommand(tenantId, id, dto.action);
    await this.commandBus.execute<ChangeProjectStatusCommand, void>(changeProjectStatusCommand);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProjectsRemove)
  @ApiOperation({ summary: 'Delete project', description: 'Removes a project from the tenant.' })
  @ApiParam({ name: 'id', description: 'Project UUID' })
  @ApiNoContentResponse({ description: 'Project deleted' })
  @ApiNotFoundResponse({ description: 'Project not found' })
  async deleteProject(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const deleteProjectCommand = new DeleteProjectCommand(tenantId, id);
    await this.commandBus.execute<DeleteProjectCommand, void>(deleteProjectCommand);
  }
}
