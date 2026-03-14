import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
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
  ApiConflictResponse,
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

import { CreateWarehouseCommand } from '../../application/commands/create-warehouse/create-warehouse.command';
import { DeactivateWarehouseCommand } from '../../application/commands/deactivate-warehouse/deactivate-warehouse.command';
import { ReactivateWarehouseCommand } from '../../application/commands/reactivate-warehouse/reactivate-warehouse.command';
import { UpdateWarehouseCommand } from '../../application/commands/update-warehouse/update-warehouse.command';
import { GetWarehouseQuery } from '../../application/queries/get-warehouse/get-warehouse.query';
import { ListWarehousesQuery } from '../../application/queries/list-warehouses/list-warehouses.query';
import { type Warehouse } from '../../domain/entities/warehouse.entity';
import { CreateWarehouseDto } from '../dtos/create-warehouse.dto';
import { UpdateWarehouseDto } from '../dtos/update-warehouse.dto';
import { WarehouseResponseDto } from '../dtos/warehouse-response.dto';

@ApiTags('Inventory')
@ApiBearerAuth('JWT')
@Controller('inventory/warehouses')
export class WarehousesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.InventoryWarehousesCreate)
  @ApiOperation({ summary: 'Create warehouse', description: 'Registers a new warehouse.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createWarehouse(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateWarehouseDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateWarehouseCommand(tenantId, dto.name, dto.location ?? null);
    const id = await this.commandBus.execute<CreateWarehouseCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.InventoryWarehousesRead)
  @ApiOperation({ summary: 'List warehouses', description: 'Returns warehouses with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of warehouses' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listWarehouses(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
  ): Promise<PaginatedResult<WarehouseResponseDto>> {
    const query = new ListWarehousesQuery(tenantId, { search, isActive }, page, limit);
    const result = await this.queryBus.execute<ListWarehousesQuery, PaginatedResult<Warehouse>>(
      query,
    );
    return {
      ...result,
      items: result.items.map((w) => new WarehouseResponseDto(w)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.InventoryWarehousesRead)
  @ApiOperation({ summary: 'Get warehouse', description: 'Returns warehouse data by ID.' })
  @ApiParam({ name: 'id', description: 'Warehouse UUID' })
  @ApiOkResponse({ type: WarehouseResponseDto })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  async getWarehouse(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<WarehouseResponseDto> {
    const query = new GetWarehouseQuery(id, tenantId);
    const warehouse = await this.queryBus.execute<GetWarehouseQuery, Warehouse>(query);
    return new WarehouseResponseDto(warehouse);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.InventoryWarehousesModify)
  @ApiOperation({ summary: 'Update warehouse', description: 'Updates warehouse data.' })
  @ApiParam({ name: 'id', description: 'Warehouse UUID' })
  @ApiNoContentResponse({ description: 'Warehouse updated' })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  async updateWarehouse(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateWarehouseDto,
  ): Promise<void> {
    const command = new UpdateWarehouseCommand(tenantId, id, dto.name, dto.location ?? null);
    await this.commandBus.execute(command);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.InventoryWarehousesModify)
  @ApiOperation({ summary: 'Reactivate warehouse', description: 'Marks the warehouse as active.' })
  @ApiParam({ name: 'id', description: 'Warehouse UUID' })
  @ApiNoContentResponse({ description: 'Warehouse reactivated' })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  @ApiConflictResponse({ description: 'Warehouse is already active' })
  async reactivateWarehouse(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ReactivateWarehouseCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.InventoryWarehousesRemove)
  @ApiOperation({
    summary: 'Deactivate warehouse',
    description: 'Marks the warehouse as inactive.',
  })
  @ApiParam({ name: 'id', description: 'Warehouse UUID' })
  @ApiNoContentResponse({ description: 'Warehouse deactivated' })
  @ApiNotFoundResponse({ description: 'Warehouse not found' })
  @ApiConflictResponse({ description: 'Warehouse is already inactive' })
  async deactivateWarehouse(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new DeactivateWarehouseCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
