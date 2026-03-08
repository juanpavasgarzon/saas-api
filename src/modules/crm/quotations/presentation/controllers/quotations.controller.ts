import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
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

import { GetCustomerQuery } from '../../../customers/application/queries/get-customer/get-customer.query';
import { type Customer } from '../../../customers/domain/entities/customer.entity';
import { GetProspectQuery } from '../../../prospects/application/queries/get-prospect/get-prospect.query';
import { type Prospect } from '../../../prospects/domain/entities/prospect.entity';
import { AcceptQuotationCommand } from '../../application/commands/accept-quotation/accept-quotation.command';
import { CreateQuotationCommand } from '../../application/commands/create-quotation/create-quotation.command';
import { DeleteQuotationCommand } from '../../application/commands/delete-quotation/delete-quotation.command';
import { ExpireQuotationCommand } from '../../application/commands/expire-quotation/expire-quotation.command';
import { RejectQuotationCommand } from '../../application/commands/reject-quotation/reject-quotation.command';
import { SendQuotationCommand } from '../../application/commands/send-quotation/send-quotation.command';
import { UpdateQuotationCommand } from '../../application/commands/update-quotation/update-quotation.command';
import { type IQuotationEmailService } from '../../application/contracts/quotation-email-service.contract';
import { type IQuotationPdfService } from '../../application/contracts/quotation-pdf-service.contract';
import { GetQuotationQuery } from '../../application/queries/get-quotation/get-quotation.query';
import { ListQuotationsQuery } from '../../application/queries/list-quotations/list-quotations.query';
import { QUOTATION_EMAIL_SERVICE } from '../../application/tokens/quotation-email-service.token';
import { QUOTATION_PDF_SERVICE } from '../../application/tokens/quotation-pdf-service.token';
import { type Quotation } from '../../domain/entities/quotation.entity';
import { QuotationStatus } from '../../domain/enums/quotation-status.enum';
import { CreateQuotationDto } from '../dtos/create-quotation.dto';
import { QuotationListResponseDto } from '../dtos/quotation-list-response.dto';
import { QuotationResponseDto } from '../dtos/quotation-response.dto';
import { SendQuotationDto } from '../dtos/send-quotation.dto';
import { UpdateQuotationDto } from '../dtos/update-quotation.dto';

@ApiTags('CRM')
@ApiBearerAuth('JWT')
@Controller('crm/quotations')
export class QuotationsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(QUOTATION_PDF_SERVICE)
    private readonly pdfService: IQuotationPdfService,
    @Inject(COMPANY_PROFILE_SERVICE)
    private readonly companyProfileService: ICompanyProfileService,
    @Inject(QUOTATION_EMAIL_SERVICE)
    private readonly emailService: IQuotationEmailService,
  ) {}

  @Post()
  @RequirePermission(Permission.CrmQuotationsCreate)
  @ApiOperation({ summary: 'Create quotation', description: 'Creates a new draft quotation.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createQuotation(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateQuotationDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateQuotationCommand(
      tenantId,
      dto.title,
      dto.customerId ?? null,
      dto.prospectId ?? null,
      dto.notes ?? null,
      dto.validUntil ? new Date(dto.validUntil) : null,
      dto.items,
    );
    const id = await this.commandBus.execute<CreateQuotationCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.CrmQuotationsRead)
  @ApiOperation({ summary: 'List quotations', description: 'Returns quotations with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of quotations' })
  @ApiQuery({ name: 'status', required: false, enum: QuotationStatus })
  @ApiQuery({ name: 'customerId', required: false })
  @ApiQuery({ name: 'prospectId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listQuotations(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: QuotationStatus,
    @Query('customerId') customerId?: string,
    @Query('prospectId') prospectId?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<QuotationListResponseDto>> {
    const query = new ListQuotationsQuery(
      tenantId,
      { status, customerId, prospectId },
      page,
      limit,
    );
    const result = await this.queryBus.execute<ListQuotationsQuery, PaginatedResult<Quotation>>(
      query,
    );
    return { ...result, items: result.items.map((q) => new QuotationListResponseDto(q)) };
  }

  @Get(':id')
  @RequirePermission(Permission.CrmQuotationsRead)
  @ApiOperation({ summary: 'Get quotation', description: 'Returns quotation data by ID.' })
  @ApiParam({ name: 'id', description: 'Quotation UUID' })
  @ApiOkResponse({ type: QuotationResponseDto })
  @ApiNotFoundResponse({ description: 'Quotation not found' })
  async getQuotation(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<QuotationResponseDto> {
    const quotation = await this.queryBus.execute<GetQuotationQuery, Quotation>(
      new GetQuotationQuery(id, tenantId),
    );
    return new QuotationResponseDto(quotation);
  }

  @Get(':id/pdf')
  @RequirePermission(Permission.CrmQuotationsDownload)
  @ApiOperation({
    summary: 'Download quotation PDF',
    description: 'Generates and downloads the quotation as a PDF.',
  })
  @ApiParam({ name: 'id', description: 'Quotation UUID' })
  @ApiProduces('application/pdf')
  @ApiOkResponse({ description: 'PDF file' })
  @ApiNotFoundResponse({ description: 'Quotation not found' })
  async downloadPdf(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const [quotation, company] = await Promise.all([
      this.queryBus.execute<GetQuotationQuery, Quotation>(new GetQuotationQuery(id, tenantId)),
      this.companyProfileService.getProfile(tenantId),
    ]);

    const pdf = await this.pdfService.generate(quotation, company.name, company.logo);
    const filename = `quotation-${String(quotation.number).padStart(4, '0')}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmQuotationsModify)
  @ApiOperation({ summary: 'Update quotation', description: 'Updates a draft quotation.' })
  @ApiParam({ name: 'id', description: 'Quotation UUID' })
  @ApiNoContentResponse({ description: 'Quotation updated' })
  @ApiNotFoundResponse({ description: 'Quotation not found' })
  async updateQuotation(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateQuotationDto,
  ): Promise<void> {
    const command = new UpdateQuotationCommand(
      id,
      tenantId,
      dto.title,
      dto.notes ?? null,
      dto.validUntil ? new Date(dto.validUntil) : null,
      dto.items,
    );
    await this.commandBus.execute(command);
  }

  @Patch(':id/send')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmQuotationsModify)
  @ApiOperation({
    summary: 'Send quotation',
    description:
      'Transitions quotation from DRAFT to SENT. Optionally sends the PDF by email to the customer or prospect.',
  })
  @ApiParam({ name: 'id', description: 'Quotation UUID' })
  @ApiBody({ type: SendQuotationDto, required: false })
  @ApiNoContentResponse({ description: 'Quotation sent' })
  @ApiNotFoundResponse({ description: 'Quotation not found' })
  async sendQuotation(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SendQuotationDto,
  ): Promise<void> {
    const command = new SendQuotationCommand(id, tenantId);
    await this.commandBus.execute(command);

    if (dto.sendEmail) {
      const [quotation, company] = await Promise.all([
        this.queryBus.execute<GetQuotationQuery, Quotation>(new GetQuotationQuery(id, tenantId)),
        this.companyProfileService.getProfile(tenantId),
      ]);

      let recipientEmail: string | null = null;

      if (quotation.customerId) {
        const customer = await this.queryBus.execute<GetCustomerQuery, Customer>(
          new GetCustomerQuery(quotation.customerId, tenantId),
        );
        recipientEmail = customer.email;
      } else if (quotation.prospectId) {
        const prospect = await this.queryBus.execute<GetProspectQuery, Prospect>(
          new GetProspectQuery(quotation.prospectId, tenantId),
        );
        recipientEmail = prospect.email;
      }

      if (recipientEmail) {
        const quotationNumber = String(quotation.number).padStart(4, '0');
        const filename = `quotation-${quotationNumber}.pdf`;
        const pdf = await this.pdfService.generate(quotation, company.name, company.logo);
        await this.emailService.sendWithPdf(recipientEmail, quotationNumber, pdf, filename);
      }
    }
  }

  @Patch(':id/accept')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmQuotationsModify)
  @ApiOperation({
    summary: 'Accept quotation',
    description: 'Transitions quotation from SENT to ACCEPTED.',
  })
  @ApiParam({ name: 'id', description: 'Quotation UUID' })
  @ApiNoContentResponse({ description: 'Quotation accepted' })
  async acceptQuotation(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new AcceptQuotationCommand(id, tenantId));
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmQuotationsModify)
  @ApiOperation({
    summary: 'Reject quotation',
    description: 'Transitions quotation from SENT to REJECTED.',
  })
  @ApiParam({ name: 'id', description: 'Quotation UUID' })
  @ApiNoContentResponse({ description: 'Quotation rejected' })
  async rejectQuotation(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new RejectQuotationCommand(id, tenantId));
  }

  @Patch(':id/expire')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmQuotationsModify)
  @ApiOperation({ summary: 'Expire quotation', description: 'Marks quotation as EXPIRED.' })
  @ApiParam({ name: 'id', description: 'Quotation UUID' })
  @ApiNoContentResponse({ description: 'Quotation expired' })
  async expireQuotation(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new ExpireQuotationCommand(id, tenantId));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmQuotationsRemove)
  @ApiOperation({ summary: 'Delete quotation', description: 'Removes the quotation.' })
  @ApiParam({ name: 'id', description: 'Quotation UUID' })
  @ApiNoContentResponse({ description: 'Quotation deleted' })
  @ApiNotFoundResponse({ description: 'Quotation not found' })
  async deleteQuotation(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteQuotationCommand(id, tenantId));
  }
}
