import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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
import { type ITransactionPdfService } from '@modules/finance/shared/contracts/transaction-pdf-service.contract';
import { TRANSACTION_PDF_SERVICE } from '@modules/finance/shared/tokens/transaction-pdf-service.token';

import { CreateTransactionCommand } from '../../application/commands/create-transaction/create-transaction.command';
import { GetTransactionQuery } from '../../application/queries/get-transaction/get-transaction.query';
import { ListTransactionsQuery } from '../../application/queries/list-transactions/list-transactions.query';
import { type AccountingTransaction } from '../../domain/entities/accounting-transaction.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionResponseDto } from '../dtos/transaction-response.dto';

@ApiTags('Finance')
@ApiBearerAuth('JWT')
@Controller('finance/accounting')
export class AccountingController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(TRANSACTION_PDF_SERVICE)
    private readonly transactionPdfService: ITransactionPdfService,
    @Inject(COMPANY_PROFILE_SERVICE)
    private readonly companyProfileService: ICompanyProfileService,
  ) {}

  @Post('transactions')
  @RequirePermission(Permission.FinanceAccountingCreate)
  @ApiOperation({ summary: 'Create transaction', description: 'Records a financial transaction.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async create(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateTransactionDto,
  ): Promise<CreatedResponseDto> {
    const createTransactionCommand = new CreateTransactionCommand(
      tenantId,
      dto.type,
      dto.amount,
      dto.description,
      dto.reference ?? null,
      dto.date ? new Date(dto.date) : null,
    );
    const id = await this.commandBus.execute<CreateTransactionCommand, string>(
      createTransactionCommand,
    );
    return new CreatedResponseDto(id);
  }

  @Get('transactions')
  @RequirePermission(Permission.FinanceAccountingRead)
  @ApiOperation({ summary: 'List transactions', description: 'Returns transactions with filters.' })
  @ApiOkResponse({ description: 'Paginated list of transactions' })
  @ApiQuery({ name: 'type', required: false, enum: ['INCOME', 'EXPENSE'] })
  @ApiQuery({ name: 'dateFrom', required: false, example: '2025-01-01' })
  @ApiQuery({ name: 'dateTo', required: false, example: '2025-12-31' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async findAll(
    @CurrentTenant() tenantId: string,
    @Query('type') type?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<TransactionResponseDto>> {
    const listTransactionsQuery = new ListTransactionsQuery(
      tenantId,
      { type, dateFrom, dateTo },
      page,
      limit,
    );
    const result = await this.queryBus.execute<
      ListTransactionsQuery,
      PaginatedResult<AccountingTransaction>
    >(listTransactionsQuery);
    return { ...result, items: result.items.map((t) => new TransactionResponseDto(t)) };
  }

  @Get('transactions/:id/pdf')
  @RequirePermission(Permission.FinanceAccountingDownload)
  @ApiOperation({
    summary: 'Download transaction receipt PDF',
    description: 'Generates and downloads the transaction as a receipt PDF.',
  })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiProduces('application/pdf')
  @ApiOkResponse({ description: 'PDF file' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  async downloadPdf(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Res() res: Response,
  ): Promise<void> {
    const [transaction, company] = await Promise.all([
      this.queryBus.execute<GetTransactionQuery, AccountingTransaction>(
        new GetTransactionQuery(id, tenantId),
      ),
      this.companyProfileService.getProfile(tenantId),
    ]);

    const pdf = await this.transactionPdfService.generate(transaction, company.name);
    const filename = `transaction-${id.slice(0, 8)}.pdf`;

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length,
    });
    res.end(pdf);
  }
}
