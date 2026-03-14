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

import { type ICompanyProfileService } from '@core/application/contracts/company-profile.contract';
import { COMPANY_PROFILE_SERVICE } from '@core/application/tokens/company-profile.token';
import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';
import { Permission } from '@core/domain/enums/permission.enum';
import { CurrentTenant } from '@core/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@core/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@core/presentation/dtos/created-response.dto';

import { ApproveDealCommand } from '../../application/commands/approve-deal/approve-deal.command';
import { CancelDealCommand } from '../../application/commands/cancel-deal/cancel-deal.command';
import { CreateDealCommand } from '../../application/commands/create-deal/create-deal.command';
import { type IDealPdfService } from '../../application/contracts/deal-pdf-service.contract';
import { GetDealQuery } from '../../application/queries/get-deal/get-deal.query';
import { ListDealsQuery } from '../../application/queries/list-deals/list-deals.query';
import { DEAL_PDF_SERVICE } from '../../application/tokens/deal-pdf-service.token';
import { type Deal } from '../../domain/entities/deal.entity';
import { DealStatus } from '../../domain/enums/deal-status.enum';
import { CreateDealDto } from '../dtos/create-deal.dto';
import { DealListResponseDto } from '../dtos/deal-list-response.dto';
import { DealResponseDto } from '../dtos/deal-response.dto';

@ApiTags('Sales')
@ApiBearerAuth('JWT')
@Controller('sales/orders')
export class SalesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(DEAL_PDF_SERVICE)
    private readonly salePdfService: IDealPdfService,
    @Inject(COMPANY_PROFILE_SERVICE)
    private readonly companyProfileService: ICompanyProfileService,
  ) {}

  @Post()
  @RequirePermission(Permission.SalesDealsCreate)
  @ApiOperation({ summary: 'Create sale', description: 'Creates a new sale manually.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createSale(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateDealDto,
  ): Promise<CreatedResponseDto> {
    const createSaleCommand = new CreateDealCommand(
      tenantId,
      dto.customerId,
      dto.notes ?? null,
      dto.items,
    );
    const id = await this.commandBus.execute<CreateDealCommand, string>(createSaleCommand);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.SalesDealsRead)
  @ApiOperation({ summary: 'List sales', description: 'Returns sales with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of sales' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: DealStatus })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listSales(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('customerId') customerId?: string,
    @Query('status') status?: string,
  ): Promise<PaginatedResult<DealListResponseDto>> {
    const listQuery = new ListDealsQuery(tenantId, { customerId, status }, page, limit);
    const result = await this.queryBus.execute<ListDealsQuery, PaginatedResult<Deal>>(listQuery);
    return {
      ...result,
      items: result.items.map((s) => new DealListResponseDto(s)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.SalesDealsRead)
  @ApiOperation({ summary: 'Get sale', description: 'Returns sale by ID.' })
  @ApiParam({ name: 'id', description: 'Sale UUID' })
  @ApiOkResponse({ type: DealResponseDto })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  async getSale(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DealResponseDto> {
    const getSaleQuery = new GetDealQuery(id, tenantId);
    const deal = await this.queryBus.execute<GetDealQuery, Deal>(getSaleQuery);
    return new DealResponseDto(deal);
  }

  @Get(':id/pdf')
  @RequirePermission(Permission.SalesDealsDownload)
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
    const getSalePdfQuery = new GetDealQuery(id, tenantId);
    const [sale, company] = await Promise.all([
      this.queryBus.execute<GetDealQuery, Deal>(getSalePdfQuery),
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
  @RequirePermission(Permission.SalesDealsApprove)
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
    const command = new ApproveDealCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.SalesDealsModify)
  @ApiOperation({ summary: 'Cancel sale', description: 'Cancels a PENDING sale.' })
  @ApiParam({ name: 'id', description: 'Sale UUID' })
  @ApiNoContentResponse({ description: 'Sale cancelled' })
  @ApiNotFoundResponse({ description: 'Sale not found' })
  async cancelSale(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new CancelDealCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
