import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Res,
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
import { CreatedResponseDto } from '@shared/presentation/dtos/created-response.dto';
import { type ISalePdfService } from '@modules/sales/sales/application/contracts/sale-pdf-service.contract';
import { SALE_PDF_SERVICE } from '@modules/sales/sales/application/tokens/sale-pdf-service.token';

import { ApproveSaleCommand } from '../../application/commands/approve-sale/approve-sale.command';
import { CancelSaleCommand } from '../../application/commands/cancel-sale/cancel-sale.command';
import { CreateSaleCommand } from '../../application/commands/create-sale/create-sale.command';
import { GetSaleQuery } from '../../application/queries/get-sale/get-sale.query';
import { ListSalesQuery } from '../../application/queries/list-sales/list-sales.query';
import { type Sale } from '../../domain/entities/sale.entity';
import { SaleStatus } from '../../domain/enums/sale-status.enum';
import { CreateSaleDto } from '../dtos/create-sale.dto';
import { SaleListResponseDto } from '../dtos/sale-list-response.dto';
import { SaleResponseDto } from '../dtos/sale-response.dto';

@ApiTags('Sales')
@ApiBearerAuth('JWT')
@Controller('sales/orders')
export class SalesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(SALE_PDF_SERVICE)
    private readonly salePdfService: ISalePdfService,
    @Inject(COMPANY_PROFILE_SERVICE)
    private readonly companyProfileService: ICompanyProfileService,
  ) {}

  @Post()
  @RequirePermission(Permission.SalesSalesCreate)
  @ApiOperation({ summary: 'Create sale', description: 'Creates a new sale manually.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createSale(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateSaleDto,
  ): Promise<CreatedResponseDto> {
    const createSaleCommand = new CreateSaleCommand(
      tenantId,
      dto.customerId,
      dto.notes ?? null,
      dto.items,
    );
    const id = await this.commandBus.execute<CreateSaleCommand, string>(createSaleCommand);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.SalesSalesRead)
  @ApiOperation({ summary: 'List sales', description: 'Returns sales with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of sales' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: SaleStatus })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listSales(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
  ): Promise<PaginatedResult<SaleListResponseDto>> {
    const listQuery = new ListSalesQuery(tenantId, { customerId, status }, page, limit);
    const result = await this.queryBus.execute<ListSalesQuery, PaginatedResult<Sale>>(listQuery);
    return {
      ...result,
      items: result.items.map((s) => new SaleListResponseDto(s)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.SalesSalesRead)
  @ApiOperation({ summary: 'Get sale', description: 'Returns sale by ID.' })
  @ApiParam({ name: 'id', description: 'Sale UUID' })
  @ApiOkResponse({ type: SaleResponseDto })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  async getSale(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SaleResponseDto> {
    const getSaleQuery = new GetSaleQuery(id, tenantId);
    const sale = await this.queryBus.execute<GetSaleQuery, Sale>(getSaleQuery);
    return new SaleResponseDto(sale);
  }

  @Get(':id/pdf')
  @RequirePermission(Permission.SalesSalesDownload)
  @ApiOperation({
    summary: 'Download sale PDF',
    description: 'Generates and downloads the sale order as a PDF.',
  })
  @ApiParam({ name: 'id', description: 'Sale UUID' })
  @ApiProduces('application/pdf')
  @ApiOkResponse({ description: 'PDF file' })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  async downloadPdf(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const getSalePdfQuery = new GetSaleQuery(id, tenantId);
    const [sale, company] = await Promise.all([
      this.queryBus.execute<GetSaleQuery, Sale>(getSalePdfQuery),
      this.companyProfileService.getProfile(tenantId),
    ]);

    const pdf = await this.salePdfService.generate(sale, company.name, company.logo);
    const filename = `sale-${String(sale.number).padStart(4, '0')}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.SalesSalesApprove)
  @ApiOperation({
    summary: 'Approve sale',
    description: 'Transitions sale from PENDING to APPROVED.',
  })
  @ApiParam({ name: 'id', description: 'Sale UUID' })
  @ApiNoContentResponse({ description: 'Sale approved' })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  async approveSale(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ApproveSaleCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.SalesSalesModify)
  @ApiOperation({ summary: 'Cancel sale', description: 'Cancels a PENDING sale.' })
  @ApiParam({ name: 'id', description: 'Sale UUID' })
  @ApiNoContentResponse({ description: 'Sale cancelled' })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  async cancelSale(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new CancelSaleCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
