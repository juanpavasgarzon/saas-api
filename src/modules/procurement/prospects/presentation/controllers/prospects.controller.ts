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
import { VendorProspectStatus } from '../../domain/enums/prospect-status.enum';
import { CreateVendorProspectDto } from '../dtos/create-prospect.dto';
import { VendorProspectResponseDto } from '../dtos/prospect-response.dto';
import { UpdateVendorProspectDto } from '../dtos/update-prospect.dto';
import { UpdateVendorProspectStatusDto } from '../dtos/update-prospect-status.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/prospects')
export class ProspectsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.ProcurementVendorsCreate)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create prospect',
    description: 'Creates a new prospect that can later be converted to a vendor.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createProspect(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateVendorProspectDto,
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
  @RequirePermission(Permission.ProcurementVendorsRead)
  @ApiOperation({
    summary: 'List prospects',
    description: 'Returns prospects with pagination.',
  })
  @ApiOkResponse({ description: 'Paginated list of vendor prospects' })
  @ApiQuery({ name: 'status', required: false, enum: VendorProspectStatus })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listProspects(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: VendorProspectStatus,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<VendorProspectResponseDto>> {
    const query = new ListProspectsQuery(tenantId, { status, search }, page, limit);
    const result = await this.queryBus.execute<ListProspectsQuery, PaginatedResult<Prospect>>(
      query,
    );
    return {
      ...result,
      items: result.items.map((p) => new VendorProspectResponseDto(p)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProcurementVendorsRead)
  @ApiOperation({ summary: 'Get prospect', description: 'Returns prospect data by ID.' })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiOkResponse({ type: VendorProspectResponseDto })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async getProspect(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<VendorProspectResponseDto> {
    const query = new GetProspectQuery(id, tenantId);
    const prospect = await this.queryBus.execute<GetProspectQuery, Prospect>(query);
    return new VendorProspectResponseDto(prospect);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementVendorsModify)
  @ApiOperation({ summary: 'Update prospect', description: 'Updates prospect data.' })
  @ApiParam({ name: 'id', description: 'Prospect UUID' })
  @ApiNoContentResponse({ description: 'Prospect updated' })
  @ApiNotFoundResponse({ description: 'Prospect not found' })
  async updateProspect(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVendorProspectDto,
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
  @RequirePermission(Permission.ProcurementVendorsModify)
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
    @Body() dto: UpdateVendorProspectStatusDto,
  ): Promise<void> {
    const command = new UpdateProspectStatusCommand(id, tenantId, dto.status);
    await this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementVendorsModify)
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
