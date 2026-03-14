import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
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

import { CreateVendorCommand } from '../../application/commands/create-vendor/create-vendor.command';
import { UpdateVendorCommand } from '../../application/commands/update-vendor/update-vendor.command';
import { GetVendorQuery } from '../../application/queries/get-vendor/get-vendor.query';
import { ListVendorsQuery } from '../../application/queries/list-vendors/list-vendors.query';
import { type Vendor } from '../../domain/entities/vendor.entity';
import { CreateVendorDto } from '../dtos/create-vendor.dto';
import { UpdateVendorDto } from '../dtos/update-vendor.dto';
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
      dto.company ?? null,
      dto.identificationNumber ?? '',
      dto.address ?? '',
      dto.contactPerson ?? null,
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<VendorResponseDto>> {
    const query = new ListVendorsQuery(tenantId, search, page, limit);
    const result = await this.queryBus.execute<ListVendorsQuery, PaginatedResult<Vendor>>(query);
    return {
      ...result,
      items: result.items.map((v) => new VendorResponseDto(v)),
    };
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

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementVendorsModify)
  @ApiOperation({ summary: 'Update vendor', description: 'Updates vendor data.' })
  @ApiParam({ name: 'id', description: 'Vendor UUID' })
  @ApiNoContentResponse({ description: 'Vendor updated' })
  @ApiNotFoundResponse({ description: 'Vendor not found' })
  async updateVendor(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVendorDto,
  ): Promise<void> {
    const command = new UpdateVendorCommand(
      tenantId,
      id,
      dto.name,
      dto.email,
      dto.phone ?? '',
      dto.company ?? null,
      dto.identificationNumber ?? '',
      dto.address ?? '',
      dto.contactPerson ?? null,
    );
    await this.commandBus.execute(command);
  }
}
