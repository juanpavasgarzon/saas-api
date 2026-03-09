import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Query,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { type Response } from 'express';

import { type ICompanyProfileService } from '@shared/application/contracts/company-profile.contract';
import { COMPANY_PROFILE_SERVICE } from '@shared/application/tokens/company-profile.token';
import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';
import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';
import { type IInvoicePdfService } from '@modules/sales/invoices/application/contracts/invoice-pdf-service.contract';
import { INVOICE_PDF_SERVICE } from '@modules/sales/invoices/application/tokens/invoice-pdf-service.token';

import { CancelInvoiceCommand } from '../../application/commands/cancel-invoice/cancel-invoice.command';
import { PayInvoiceCommand } from '../../application/commands/pay-invoice/pay-invoice.command';
import { SendInvoiceCommand } from '../../application/commands/send-invoice/send-invoice.command';
import { GetInvoiceQuery } from '../../application/queries/get-invoice/get-invoice.query';
import { ListInvoicesQuery } from '../../application/queries/list-invoices/list-invoices.query';
import { type Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceStatus } from '../../domain/enums/invoice-status.enum';
import { InvoiceListResponseDto } from '../dtos/invoice-list-response.dto';
import { InvoiceResponseDto } from '../dtos/invoice-response.dto';

@ApiTags('Sales')
@ApiBearerAuth('JWT')
@Controller('sales/invoices')
export class InvoicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(INVOICE_PDF_SERVICE)
    private readonly invoicePdfService: IInvoicePdfService,
    @Inject(COMPANY_PROFILE_SERVICE)
    private readonly companyProfileService: ICompanyProfileService,
  ) {}

  @Get()
  @RequirePermission(Permission.SalesInvoicesRead)
  @ApiOperation({ summary: 'List invoices', description: 'Returns invoices with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of invoices' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'saleId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: InvoiceStatus })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listInvoices(
    @CurrentTenant() tenantId: string,
    @Query('customerId') customerId?: string,
    @Query('saleId') saleId?: string,
    @Query('status') status?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<InvoiceListResponseDto>> {
    const listQuery = new ListInvoicesQuery(tenantId, { customerId, saleId, status }, page, limit);
    const result = await this.queryBus.execute<ListInvoicesQuery, PaginatedResult<Invoice>>(
      listQuery,
    );
    return {
      ...result,
      items: result.items.map((i) => new InvoiceListResponseDto(i)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.SalesInvoicesRead)
  @ApiOperation({ summary: 'Get invoice', description: 'Returns invoice by ID.' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiOkResponse({ type: InvoiceResponseDto })
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  async getInvoice(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<InvoiceResponseDto> {
    const getInvoiceQuery = new GetInvoiceQuery(id, tenantId);
    const invoice = await this.queryBus.execute<GetInvoiceQuery, Invoice>(getInvoiceQuery);
    return new InvoiceResponseDto(invoice);
  }

  @Get(':id/pdf')
  @RequirePermission(Permission.SalesInvoicesDownload)
  @ApiOperation({
    summary: 'Download invoice PDF',
    description: 'Generates and downloads the invoice as a PDF.',
  })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiProduces('application/pdf')
  @ApiOkResponse({ description: 'PDF file' })
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  async downloadPdf(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const getInvoicePdfQuery = new GetInvoiceQuery(id, tenantId);
    const [invoice, company] = await Promise.all([
      this.queryBus.execute<GetInvoiceQuery, Invoice>(getInvoicePdfQuery),
      this.companyProfileService.getProfile(tenantId),
    ]);

    const pdf = await this.invoicePdfService.generate(invoice, company.name, company.logo);
    const filename = `invoice-${String(invoice.number).padStart(4, '0')}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @Patch(':id/send')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.SalesInvoicesSend)
  @ApiOperation({ summary: 'Send invoice', description: 'Transitions invoice from DRAFT to SENT.' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiNoContentResponse({ description: 'Invoice sent' })
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  async sendInvoice(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new SendInvoiceCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/pay')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.SalesInvoicesPay)
  @ApiOperation({ summary: 'Pay invoice', description: 'Transitions invoice from SENT to PAID.' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiNoContentResponse({ description: 'Invoice paid' })
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  async payInvoice(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new PayInvoiceCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.SalesInvoicesModify)
  @ApiOperation({ summary: 'Cancel invoice', description: 'Cancels a DRAFT or SENT invoice.' })
  @ApiParam({ name: 'id', description: 'Invoice UUID' })
  @ApiNoContentResponse({ description: 'Invoice cancelled' })
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  async cancelInvoice(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new CancelInvoiceCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
