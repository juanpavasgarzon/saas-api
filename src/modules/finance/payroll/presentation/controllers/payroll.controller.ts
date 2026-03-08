import {
  Body,
  Controller,
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
import { type IPayrollPdfService } from '@modules/finance/shared/contracts/payroll-pdf-service.contract';
import { PAYROLL_PDF_SERVICE } from '@modules/finance/shared/tokens/payroll-pdf-service.token';

import { CreatePayrollEntryCommand } from '../../application/commands/create-payroll-entry/create-payroll-entry.command';
import { MarkAsPaidCommand } from '../../application/commands/mark-as-paid/mark-as-paid.command';
import { GetPayrollEntryQuery } from '../../application/queries/get-payroll-entry/get-payroll-entry.query';
import { ListPayrollQuery } from '../../application/queries/list-payroll/list-payroll.query';
import { type PayrollEntry } from '../../domain/entities/payroll-entry.entity';
import { CreatePayrollEntryDto } from '../dtos/create-payroll-entry.dto';
import { PayrollEntryResponseDto } from '../dtos/payroll-entry-response.dto';

@ApiTags('Finance')
@ApiBearerAuth('JWT')
@Controller('finance/payroll')
export class PayrollController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(PAYROLL_PDF_SERVICE)
    private readonly payrollPdfService: IPayrollPdfService,
    @Inject(COMPANY_PROFILE_SERVICE)
    private readonly companyProfileService: ICompanyProfileService,
  ) {}

  @Post()
  @RequirePermission(Permission.FinancePayrollCreate)
  @ApiOperation({ summary: 'Create payroll entry', description: 'Creates a payroll record.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreatePayrollEntryDto,
  ): Promise<CreatedResponseDto> {
    const createPayrollEntryCommand = new CreatePayrollEntryCommand(
      tenantId,
      dto.employeeId,
      dto.period,
      dto.daysWorked,
      dto.baseSalary,
      dto.bonuses ?? 0,
      dto.deductions ?? 0,
    );
    const id = await this.commandBus.execute<CreatePayrollEntryCommand, string>(
      createPayrollEntryCommand,
    );
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.FinancePayrollRead)
  @ApiOperation({ summary: 'List payroll entries', description: 'Returns payroll records.' })
  @ApiOkResponse({ description: 'Paginated list of payroll entries' })
  @ApiQuery({ name: 'employeeId', required: false })
  @ApiQuery({ name: 'period', required: false, example: '2025-03' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'PAID'] })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('employeeId') employeeId?: string,
    @Query('period') period?: string,
    @Query('status') status?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<PayrollEntryResponseDto>> {
    const listPayrollQuery = new ListPayrollQuery(
      tenantId,
      { employeeId, period, status },
      page,
      limit,
    );
    const result = await this.queryBus.execute<ListPayrollQuery, PaginatedResult<PayrollEntry>>(
      listPayrollQuery,
    );
    return { ...result, items: result.items.map((e) => new PayrollEntryResponseDto(e)) };
  }

  @Get(':id/pdf')
  @RequirePermission(Permission.FinancePayrollDownload)
  @ApiOperation({
    summary: 'Download pay stub PDF',
    description: 'Generates and downloads the payroll entry as a pay stub PDF.',
  })
  @ApiParam({ name: 'id', description: 'Payroll entry UUID' })
  @ApiProduces('application/pdf')
  @ApiOkResponse({ description: 'PDF file' })
  @ApiNotFoundResponse({ description: 'Payroll entry not found' })
  async downloadPdf(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const [entry, company] = await Promise.all([
      this.queryBus.execute<GetPayrollEntryQuery, PayrollEntry>(
        new GetPayrollEntryQuery(id, tenantId),
      ),
      this.companyProfileService.getProfile(tenantId),
    ]);

    const pdf = await this.payrollPdfService.generate(entry, company.name);
    const filename = `payroll-${entry.period}-${id.slice(0, 8)}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }

  @Patch(':id/pay')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.FinancePayrollModify)
  @ApiOperation({ summary: 'Mark as paid', description: 'Marks a payroll entry as paid.' })
  @ApiParam({ name: 'id', description: 'Payroll entry UUID' })
  @ApiNoContentResponse({ description: 'Payroll entry marked as paid' })
  @ApiNotFoundResponse({ description: 'Payroll entry not found' })
  async markAsPaid(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentTenant() tenantId: string,
  ): Promise<void> {
    const markAsPaidCommand = new MarkAsPaidCommand(id, tenantId);
    await this.commandBus.execute(markAsPaidCommand);
  }
}
