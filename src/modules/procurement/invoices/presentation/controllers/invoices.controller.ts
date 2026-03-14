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
  Patch,
  Post,
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

import { CreateInvoiceCommand } from '../../application/commands/create-invoice/create-invoice.command';
import { MarkInvoiceOverdueCommand } from '../../application/commands/mark-invoice-overdue/mark-invoice-overdue.command';
import { MarkInvoicePaidCommand } from '../../application/commands/mark-invoice-paid/mark-invoice-paid.command';
import { GetInvoiceQuery } from '../../application/queries/get-invoice/get-invoice.query';
import { ListInvoicesQuery } from '../../application/queries/list-invoices/list-invoices.query';
import { type Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceStatus } from '../../domain/enums/invoice-status.enum';
import { CreateInvoiceDto } from '../dtos/create-invoice.dto';
import { SupplierInvoiceResponseDto } from '../dtos/invoice-response.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/invoices')
export class InvoicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.ProcurementInvoicesCreate)
  @ApiOperation({
    summary: 'Create supplier invoice',
    description: 'Manually creates a supplier invoice for a purchase order.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createInvoice(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateInvoiceDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateInvoiceCommand(
      tenantId,
      dto.invoiceNumber,
      dto.supplierId,
      dto.orderId,
      dto.amount,
      dto.dueDate ?? null,
      dto.notes ?? null,
    );
    const id = await this.commandBus.execute<CreateInvoiceCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.ProcurementInvoicesRead)
  @ApiOperation({
    summary: 'List supplier invoices',
    description: 'Returns paginated supplier invoices with optional filters.',
  })
  @ApiOkResponse({ description: 'Paginated list of supplier invoices' })
  @ApiQuery({ name: 'status', required: false, enum: InvoiceStatus })
  @ApiQuery({ name: 'supplierId', required: false })
  @ApiQuery({ name: 'orderId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listInvoices(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: InvoiceStatus,
    @Query('supplierId') supplierId?: string,
    @Query('orderId') orderId?: string,
  ): Promise<PaginatedResult<SupplierInvoiceResponseDto>> {
    const query = new ListInvoicesQuery(tenantId, status, supplierId, orderId, page, limit);
    const result = await this.queryBus.execute<ListInvoicesQuery, PaginatedResult<Invoice>>(query);
    return {
      ...result,
      items: result.items.map((inv) => new SupplierInvoiceResponseDto(inv)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProcurementInvoicesRead)
  @ApiOperation({
    summary: 'Get supplier invoice',
    description: 'Returns a supplier invoice by ID.',
  })
  @ApiParam({ name: 'id', description: 'Supplier invoice UUID' })
  @ApiOkResponse({ type: SupplierInvoiceResponseDto })
  @ApiNotFoundResponse({ description: 'Supplier invoice not found' })
  async getInvoice(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SupplierInvoiceResponseDto> {
    const query = new GetInvoiceQuery(id, tenantId);
    const invoice = await this.queryBus.execute<GetInvoiceQuery, Invoice>(query);
    return new SupplierInvoiceResponseDto(invoice);
  }

  @Patch(':id/pay')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementInvoicesPay)
  @ApiOperation({
    summary: 'Mark supplier invoice as paid',
    description: 'Transitions the invoice status to PAID.',
  })
  @ApiParam({ name: 'id', description: 'Supplier invoice UUID' })
  @ApiNoContentResponse({ description: 'Invoice marked as paid' })
  @ApiNotFoundResponse({ description: 'Supplier invoice not found' })
  async markPaid(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new MarkInvoicePaidCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/overdue')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementInvoicesModify)
  @ApiOperation({
    summary: 'Mark supplier invoice as overdue',
    description: 'Transitions the invoice status to OVERDUE.',
  })
  @ApiParam({ name: 'id', description: 'Supplier invoice UUID' })
  @ApiNoContentResponse({ description: 'Invoice marked as overdue' })
  @ApiNotFoundResponse({ description: 'Supplier invoice not found' })
  async markOverdue(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new MarkInvoiceOverdueCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
