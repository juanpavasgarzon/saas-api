import {
  Controller,
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

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';
import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';

import { CancelPurchaseOrderCommand } from '../../application/commands/cancel-purchase-order/cancel-purchase-order.command';
import { ReceivePurchaseOrderCommand } from '../../application/commands/receive-purchase-order/receive-purchase-order.command';
import { GetPurchaseOrderQuery } from '../../application/queries/get-purchase-order/get-purchase-order.query';
import { ListPurchaseOrdersQuery } from '../../application/queries/list-purchase-orders/list-purchase-orders.query';
import { type PurchaseOrder } from '../../domain/entities/purchase-order.entity';
import { PurchaseOrderStatus } from '../../domain/enums/purchase-order-status.enum';
import { PurchaseOrderResponseDto } from '../dtos/purchase-order-response.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/purchase-orders')
export class PurchaseOrdersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermission(Permission.ProcurementPurchaseOrdersRead)
  @ApiOperation({
    summary: 'List purchase orders',
    description: 'Returns purchase orders with pagination.',
  })
  @ApiOkResponse({ description: 'Paginated list of purchase orders' })
  @ApiQuery({ name: 'status', required: false, enum: PurchaseOrderStatus })
  @ApiQuery({ name: 'vendorId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listPurchaseOrders(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: PurchaseOrderStatus,
    @Query('vendorId') vendorId?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<PurchaseOrderResponseDto>> {
    const query = new ListPurchaseOrdersQuery(tenantId, status, vendorId, page, limit);
    const result = await this.queryBus.execute<
      ListPurchaseOrdersQuery,
      PaginatedResult<PurchaseOrder>
    >(query);
    return {
      ...result,
      items: result.items.map((po) => new PurchaseOrderResponseDto(po)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProcurementPurchaseOrdersRead)
  @ApiOperation({
    summary: 'Get purchase order',
    description: 'Returns purchase order data by ID.',
  })
  @ApiParam({ name: 'id', description: 'Purchase order UUID' })
  @ApiOkResponse({ type: PurchaseOrderResponseDto })
  @ApiNotFoundResponse({ description: 'Purchase order not found' })
  async getPurchaseOrder(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PurchaseOrderResponseDto> {
    const query = new GetPurchaseOrderQuery(id, tenantId);
    const po = await this.queryBus.execute<GetPurchaseOrderQuery, PurchaseOrder>(query);
    return new PurchaseOrderResponseDto(po);
  }

  @Patch(':id/receive')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementPurchaseOrdersReceive)
  @ApiOperation({
    summary: 'Receive purchase order',
    description: 'Marks the purchase order as RECEIVED.',
  })
  @ApiParam({ name: 'id', description: 'Purchase order UUID' })
  @ApiNoContentResponse({ description: 'Purchase order received' })
  @ApiNotFoundResponse({ description: 'Purchase order not found' })
  async receivePurchaseOrder(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ReceivePurchaseOrderCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementPurchaseOrdersCancel)
  @ApiOperation({
    summary: 'Cancel purchase order',
    description: 'Marks the purchase order as CANCELLED.',
  })
  @ApiParam({ name: 'id', description: 'Purchase order UUID' })
  @ApiNoContentResponse({ description: 'Purchase order cancelled' })
  @ApiNotFoundResponse({ description: 'Purchase order not found' })
  async cancelPurchaseOrder(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new CancelPurchaseOrderCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
