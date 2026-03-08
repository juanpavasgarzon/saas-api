import {
  Body,
  Controller,
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

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';
import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@shared/presentation/dtos/created-response.dto';

import { CreateProspectCommand } from '../../application/commands/create-prospect/create-prospect.command';
import { DeleteProspectCommand } from '../../application/commands/delete-prospect/delete-prospect.command';
import { UpdateProspectCommand } from '../../application/commands/update-prospect/update-prospect.command';
import { UpdateProspectStatusCommand } from '../../application/commands/update-prospect-status/update-prospect-status.command';
import { GetProspectQuery } from '../../application/queries/get-prospect/get-prospect.query';
import { ListProspectsQuery } from '../../application/queries/list-prospects/list-prospects.query';
import { type Prospect } from '../../domain/entities/prospect.entity';
import { ProspectStatus } from '../../domain/enums/prospect-status.enum';
import { CreateProspectDto } from '../dtos/create-prospect.dto';
import { ProspectResponseDto } from '../dtos/prospect-response.dto';
import { UpdateProspectDto } from '../dtos/update-prospect.dto';
import { UpdateProspectStatusDto } from '../dtos/update-prospect-status.dto';

@ApiTags('CRM')
@ApiBearerAuth('JWT')
@Controller('crm/prospects')
export class ProspectsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.CrmProspectsCreate)
  @ApiOperation({ summary: 'Create prospect', description: 'Registers a new prospect.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createProspect(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateProspectDto,
  ): Promise<CreatedResponseDto> {
    const createProspectCommand = new CreateProspectCommand(
      tenantId,
      dto.name,
      dto.email ?? null,
      dto.phone ?? null,
      dto.company ?? null,
      dto.source ?? null,
      dto.notes ?? null,
    );
    const id = await this.commandBus.execute<CreateProspectCommand, string>(createProspectCommand);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.CrmProspectsRead)
  @ApiOperation({ summary: 'List prospects', description: 'Returns prospects with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of prospects' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ProspectStatus,
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listProspects(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: ProspectStatus,
    @Query('search') search?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<ProspectResponseDto>> {
    const listProspectsQuery = new ListProspectsQuery(tenantId, { status, search }, page, limit);
    const result = await this.queryBus.execute<ListProspectsQuery, PaginatedResult<Prospect>>(
      listProspectsQuery,
    );
    return { ...result, items: result.items.map((p) => new ProspectResponseDto(p)) };
  }

  @Get(':id')
  @RequirePermission(Permission.CrmProspectsRead)
  @ApiOperation({ summary: 'Get prospect', description: 'Returns prospect data by ID.' })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiOkResponse({ type: ProspectResponseDto })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async getProspect(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProspectResponseDto> {
    const getProspectQuery = new GetProspectQuery(id, tenantId);
    const prospect = await this.queryBus.execute<GetProspectQuery, Prospect>(getProspectQuery);
    return new ProspectResponseDto(prospect);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmProspectsModify)
  @ApiOperation({ summary: 'Update prospect', description: 'Updates prospect data.' })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiNoContentResponse({ description: 'Prospect updated' })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async updateProspect(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProspectDto,
  ): Promise<void> {
    const updateProspectCommand = new UpdateProspectCommand(
      id,
      tenantId,
      dto.name,
      dto.email ?? null,
      dto.phone ?? null,
      dto.company ?? null,
      dto.source ?? null,
      dto.notes ?? null,
    );
    await this.commandBus.execute(updateProspectCommand);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmProspectsModify)
  @ApiOperation({ summary: 'Update prospect status', description: 'Changes the prospect status.' })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiNoContentResponse({ description: 'Status updated' })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async updateStatus(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProspectStatusDto,
  ): Promise<void> {
    const updateProspectStatusCommand = new UpdateProspectStatusCommand(id, tenantId, dto.status);
    await this.commandBus.execute(updateProspectStatusCommand);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmProspectsRemove)
  @ApiOperation({ summary: 'Delete prospect', description: 'Removes the prospect.' })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiNoContentResponse({ description: 'Prospect deleted' })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async deleteProspect(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const deleteProspectCommand = new DeleteProspectCommand(id, tenantId);
    await this.commandBus.execute(deleteProspectCommand);
  }
}
