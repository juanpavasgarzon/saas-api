import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
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

import { GetStockQuery } from '../../application/queries/get-stock/get-stock.query';
import { ListStockQuery } from '../../application/queries/list-stock/list-stock.query';
import { type Stock } from '../../domain/entities/stock.entity';
import { StockResponseDto } from '../dtos/stock-response.dto';

@ApiTags('Inventory')
@ApiBearerAuth('JWT')
@Controller('inventory/stock')
export class StockController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @RequirePermission(Permission.InventoryStockRead)
  @ApiOperation({ summary: 'List stock', description: 'Returns stock levels with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of stock entries' })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listStock(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
  ): Promise<PaginatedResult<StockResponseDto>> {
    const query = new ListStockQuery(tenantId, { productId, warehouseId }, page, limit);
    const result = await this.queryBus.execute<ListStockQuery, PaginatedResult<Stock>>(query);
    return {
      ...result,
      items: result.items.map((s) => new StockResponseDto(s)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.InventoryStockRead)
  @ApiOperation({ summary: 'Get stock', description: 'Returns stock entry by ID.' })
  @ApiParam({ name: 'id', description: 'Stock UUID' })
  @ApiOkResponse({ type: StockResponseDto })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  async getStock(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<StockResponseDto> {
    const query = new GetStockQuery(id, tenantId);
    const stock = await this.queryBus.execute<GetStockQuery, Stock>(query);
    return new StockResponseDto(stock);
  }
}
