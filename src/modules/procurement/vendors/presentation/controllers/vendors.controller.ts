import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';
import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@shared/presentation/dtos/created-response.dto';

import { CreateVendorCommand } from '../../application/commands/create-vendor/create-vendor.command';
import { GetVendorQuery } from '../../application/queries/get-vendor/get-vendor.query';
import { ListVendorsQuery } from '../../application/queries/list-vendors/list-vendors.query';
import { type Vendor } from '../../domain/entities/vendor.entity';
import { CreateVendorDto } from '../dtos/create-vendor.dto';
import { VendorResponseDto } from '../dtos/vendor-response.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/vendors')
export class VendorsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.ProcurementVendorsCreate)
  @ApiOperation({ summary: 'Create vendor', description: 'Creates a new active vendor.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createVendor(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateVendorDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateVendorCommand(
      tenantId,
      dto.name,
      dto.email,
      dto.phone ?? '',
      dto.address ?? '',
      dto.contactPerson ?? '',
    );
    const id = await this.commandBus.execute<CreateVendorCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.ProcurementVendorsRead)
  @ApiOperation({ summary: 'List vendors', description: 'Returns vendors with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of vendors' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter by name (case-insensitive)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listVendors(
    @CurrentTenant() tenantId: string,
    @Query('search') search?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<VendorResponseDto>> {
    const query = new ListVendorsQuery(tenantId, search, page, limit);
    const result = await this.queryBus.execute<ListVendorsQuery, PaginatedResult<Vendor>>(query);
    return { ...result, items: result.items.map((v) => new VendorResponseDto(v)) };
  }

  @Get(':id')
  @RequirePermission(Permission.ProcurementVendorsRead)
  @ApiOperation({ summary: 'Get vendor', description: 'Returns vendor data by ID.' })
  @ApiParam({ name: 'id', description: 'Vendor UUID' })
  @ApiOkResponse({ type: VendorResponseDto })
  @ApiNotFoundResponse({ description: 'Vendor not found' })
  async getVendor(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<VendorResponseDto> {
    const query = new GetVendorQuery(id, tenantId);
    const vendor = await this.queryBus.execute<GetVendorQuery, Vendor>(query);
    return new VendorResponseDto(vendor);
  }
}
