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

import { CreateProspectCommand } from '../../application/commands/create-prospect/create-prospect.command';
import { DeleteProspectCommand } from '../../application/commands/delete-prospect/delete-prospect.command';
import { UpdateProspectCommand } from '../../application/commands/update-prospect/update-prospect.command';
import { UpdateProspectStatusCommand } from '../../application/commands/update-prospect-status/update-prospect-status.command';
import { GetProspectQuery } from '../../application/queries/get-prospect/get-prospect.query';
import { ListProspectsQuery } from '../../application/queries/list-prospects/list-prospects.query';
import { type Prospect } from '../../domain/entities/prospect.entity';
import { SupplierProspectStatus } from '../../domain/enums/prospect-status.enum';
import { CreateSupplierProspectDto } from '../dtos/create-prospect.dto';
import { SupplierProspectResponseDto } from '../dtos/prospect-response.dto';
import { UpdateSupplierProspectDto } from '../dtos/update-prospect.dto';
import { UpdateSupplierProspectStatusDto } from '../dtos/update-prospect-status.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/prospects')
export class ProspectsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.ProcurementSuppliersCreate)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create prospect',
    description: 'Creates a new prospect that can later be converted to a supplier.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createProspect(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateSupplierProspectDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateProspectCommand(
      tenantId,
      dto.name,
      dto.email ?? null,
      dto.phone ?? null,
      dto.company ?? null,
      dto.identificationNumber ?? null,
      dto.address ?? null,
      dto.contactPerson ?? null,
      dto.notes ?? null,
    );
    const id = await this.commandBus.execute<CreateProspectCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.ProcurementSuppliersRead)
  @ApiOperation({
    summary: 'List prospects',
    description: 'Returns prospects with pagination.',
  })
  @ApiOkResponse({ description: 'Paginated list of supplier prospects' })
  @ApiQuery({ name: 'status', required: false, enum: SupplierProspectStatus })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listProspects(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: SupplierProspectStatus,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<SupplierProspectResponseDto>> {
    const query = new ListProspectsQuery(tenantId, { status, search }, page, limit);
    const result = await this.queryBus.execute<ListProspectsQuery, PaginatedResult<Prospect>>(
      query,
    );
    return {
      ...result,
      items: result.items.map((p) => new SupplierProspectResponseDto(p)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProcurementSuppliersRead)
  @ApiOperation({ summary: 'Get prospect', description: 'Returns prospect data by ID.' })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiOkResponse({ type: SupplierProspectResponseDto })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async getProspect(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SupplierProspectResponseDto> {
    const query = new GetProspectQuery(id, tenantId);
    const prospect = await this.queryBus.execute<GetProspectQuery, Prospect>(query);
    return new SupplierProspectResponseDto(prospect);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementSuppliersModify)
  @ApiOperation({ summary: 'Update prospect', description: 'Updates prospect data.' })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiNoContentResponse({ description: 'Prospect updated' })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async updateProspect(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSupplierProspectDto,
  ): Promise<void> {
    const command = new UpdateProspectCommand(
      id,
      tenantId,
      dto.name,
      dto.email ?? null,
      dto.phone ?? null,
      dto.company ?? null,
      dto.identificationNumber ?? null,
      dto.address ?? null,
      dto.contactPerson ?? null,
      dto.notes ?? null,
    );
    await this.commandBus.execute(command);
  }

  @Patch(':id/status')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementSuppliersModify)
  @ApiOperation({
    summary: 'Update prospect status',
    description: 'Changes the prospect status.',
  })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiNoContentResponse({ description: 'Status updated' })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async updateStatus(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSupplierProspectStatusDto,
  ): Promise<void> {
    const command = new UpdateProspectStatusCommand(id, tenantId, dto.status);
    await this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementSuppliersModify)
  @ApiOperation({ summary: 'Delete prospect', description: 'Removes the prospect.' })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiNoContentResponse({ description: 'Prospect deleted' })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async deleteProspect(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new DeleteProspectCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
