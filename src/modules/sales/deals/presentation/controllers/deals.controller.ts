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

@ApiTags('Deals')
@ApiBearerAuth('JWT')
@Controller('deals')
export class DealsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(DEAL_PDF_SERVICE)
    private readonly dealPdfService: IDealPdfService,
    @Inject(COMPANY_PROFILE_SERVICE)
    private readonly companyProfileService: ICompanyProfileService,
  ) {}

  @Post()
  @RequirePermission(Permission.SalesDealsCreate)
  @ApiOperation({ summary: 'Create deal', description: 'Creates a new deal manually.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createDeal(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateDealDto,
  ): Promise<CreatedResponseDto> {
    const createDealCommand = new CreateDealCommand(
      tenantId,
      dto.customerId,
      dto.notes ?? null,
      dto.items,
    );
    const id = await this.commandBus.execute<CreateDealCommand, string>(createDealCommand);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.SalesDealsRead)
  @ApiOperation({ summary: 'List deals', description: 'Returns deals with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of deals' })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: DealStatus })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listDeals(
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
  @ApiOperation({ summary: 'Get deal', description: 'Returns deal by ID.' })
  @ApiParam({ name: 'id', description: 'Deal UUID' })
  @ApiOkResponse({ type: DealResponseDto })
  @ApiNotFoundResponse({ description: 'Deal not found' })
  async getDeal(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<DealResponseDto> {
    const getDealQuery = new GetDealQuery(id, tenantId);
    const deal = await this.queryBus.execute<GetDealQuery, Deal>(getDealQuery);
    return new DealResponseDto(deal);
  }

  @Get(':id/pdf')
  @RequirePermission(Permission.SalesDealsDownload)
  @ApiOperation({
    summary: 'Download deal PDF',
    description: 'Generates and downloads the deal order as a PDF.',
  })
  @ApiParam({ name: 'id', description: 'Deal UUID' })
  @ApiProduces('application/pdf')
  @ApiOkResponse({ description: 'PDF file' })
  @ApiNotFoundResponse({ description: 'Deal not found' })
  async downloadPdf(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const getDealPdfQuery = new GetDealQuery(id, tenantId);
    const [deal, company] = await Promise.all([
      this.queryBus.execute<GetDealQuery, Deal>(getDealPdfQuery),
      this.companyProfileService.getProfile(tenantId),
    ]);

    const pdf = await this.dealPdfService.generate(deal, company.name, company.logo);
    const filename = `deal-${String(deal.number).padStart(4, '0')}.pdf`;

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
    summary: 'Approve deal',
    description: 'Transitions deal from PENDING to APPROVED.',
  })
  @ApiParam({ name: 'id', description: 'Deal UUID' })
  @ApiNoContentResponse({ description: 'Deal approved' })
  @ApiNotFoundResponse({ description: 'Deal not found' })
  async approveDeal(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ApproveDealCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/cancel')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.SalesDealsModify)
  @ApiOperation({ summary: 'Cancel deal', description: 'Cancels a PENDING deal.' })
  @ApiParam({ name: 'id', description: 'Deal UUID' })
  @ApiNoContentResponse({ description: 'Deal cancelled' })
  @ApiNotFoundResponse({ description: 'Deal not found' })
  async cancelDeal(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new CancelDealCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
