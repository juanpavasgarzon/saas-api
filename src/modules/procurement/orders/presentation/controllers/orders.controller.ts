import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
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

import { CancelOrderCommand } from '../../application/commands/cancel-order/cancel-order.command';
import { ReceiveOrderCommand } from '../../application/commands/receive-order/receive-order.command';
import { GetOrderQuery } from '../../application/queries/get-order/get-order.query';
import { ListOrdersQuery } from '../../application/queries/list-orders/list-orders.query';
import { type Order } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/enums/order-status.enum';
import { OrderResponseDto } from '../dtos/order-response.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/orders')
export class OrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermission(Permission.ProcurementOrdersRead)
  @ApiOperation({
    summary: 'List purchase orders',
    description: 'Returns purchase orders with pagination.',
  })
  @ApiOkResponse({ description: 'Paginated list of purchase orders' })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  @ApiQuery({ name: 'supplierId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listOrders(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: OrderStatus,
    @Query('supplierId') supplierId?: string,
  ): Promise<PaginatedResult<OrderResponseDto>> {
    const query = new ListOrdersQuery(tenantId, status, supplierId, page, limit);
    const result = await this.queryBus.execute<ListOrdersQuery, PaginatedResult<Order>>(query);
    return {
      ...result,
      items: result.items.map((po) => new OrderResponseDto(po)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProcurementOrdersRead)
  @ApiOperation({
    summary: 'Get purchase order',
    description: 'Returns purchase order data by ID.',
  })
  @ApiParam({ name: 'id', description: 'Purchase order UUID' })
  @ApiOkResponse({ type: OrderResponseDto })
  @ApiNotFoundResponse({ description: 'Purchase order not found' })
  async getOrder(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<OrderResponseDto> {
    const query = new GetOrderQuery(id, tenantId);
    const po = await this.queryBus.execute<GetOrderQuery, Order>(query);
    return new OrderResponseDto(po);
  }

  @Patch(':id/receive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementOrdersReceive)
  @ApiOperation({
    summary: 'Receive purchase order',
    description: 'Marks the purchase order as RECEIVED.',
  })
  @ApiParam({ name: 'id', description: 'Purchase order UUID' })
  @ApiNoContentResponse({ description: 'Purchase order received' })
  @ApiNotFoundResponse({ description: 'Purchase order not found' })
  async receiveOrder(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ReceiveOrderCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementOrdersCancel)
  @ApiOperation({
    summary: 'Cancel purchase order',
    description: 'Marks the purchase order as CANCELLED.',
  })
  @ApiParam({ name: 'id', description: 'Purchase order UUID' })
  @ApiNoContentResponse({ description: 'Purchase order cancelled' })
  @ApiNotFoundResponse({ description: 'Purchase order not found' })
  async cancelOrder(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new CancelOrderCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
