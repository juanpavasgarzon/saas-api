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

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';
import { Permission } from '@core/domain/enums/permission.enum';
import { CurrentTenant } from '@core/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@core/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@core/presentation/dtos/created-response.dto';

import { CreateSupplierCommand } from '../../application/commands/create-supplier/create-supplier.command';
import { UpdateSupplierCommand } from '../../application/commands/update-supplier/update-supplier.command';
import { GetSupplierQuery } from '../../application/queries/get-supplier/get-supplier.query';
import { ListSuppliersQuery } from '../../application/queries/list-suppliers/list-suppliers.query';
import { type Supplier } from '../../domain/entities/supplier.entity';
import { CreateSupplierDto } from '../dtos/create-supplier.dto';
import { SupplierResponseDto } from '../dtos/supplier-response.dto';
import { UpdateSupplierDto } from '../dtos/update-supplier.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/suppliers')
export class SuppliersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.ProcurementSuppliersCreate)
  @ApiOperation({ summary: 'Create supplier', description: 'Creates a new active supplier.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createSupplier(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateSupplierDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateSupplierCommand(
      tenantId,
      dto.name,
      dto.email,
      dto.phone ?? '',
      dto.company ?? null,
      dto.identificationNumber ?? '',
      dto.address ?? '',
      dto.contactPerson ?? null,
    );
    const id = await this.commandBus.execute<CreateSupplierCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.ProcurementSuppliersRead)
  @ApiOperation({ summary: 'List suppliers', description: 'Returns suppliers with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of suppliers' })
  @ApiQuery({ name: 'search', required: false, description: 'Filter by name (case-insensitive)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listSuppliers(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<SupplierResponseDto>> {
    const query = new ListSuppliersQuery(tenantId, search, page, limit);
    const result = await this.queryBus.execute<ListSuppliersQuery, PaginatedResult<Supplier>>(
      query,
    );
    return {
      ...result,
      items: result.items.map((v) => new SupplierResponseDto(v)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProcurementSuppliersRead)
  @ApiOperation({ summary: 'Get supplier', description: 'Returns supplier data by ID.' })
  @ApiParam({ name: 'id', description: 'Supplier UUID' })
  @ApiOkResponse({ type: SupplierResponseDto })
  @ApiNotFoundResponse({ description: 'Supplier not found' })
  async getSupplier(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SupplierResponseDto> {
    const query = new GetSupplierQuery(id, tenantId);
    const supplier = await this.queryBus.execute<GetSupplierQuery, Supplier>(query);
    return new SupplierResponseDto(supplier);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementSuppliersModify)
  @ApiOperation({ summary: 'Update supplier', description: 'Updates supplier data.' })
  @ApiParam({ name: 'id', description: 'Supplier UUID' })
  @ApiNoContentResponse({ description: 'Supplier updated' })
  @ApiNotFoundResponse({ description: 'Supplier not found' })
  async updateSupplier(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSupplierDto,
  ): Promise<void> {
    const command = new UpdateSupplierCommand(
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
