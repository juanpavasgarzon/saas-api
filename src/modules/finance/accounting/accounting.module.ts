import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationModule } from '@modules/organization/organization.module';

import { CreateTransactionHandler } from './application/commands/create-transaction/create-transaction.handler';
import { GetTransactionHandler } from './application/queries/get-transaction/get-transaction.handler';
import { ListTransactionsHandler } from './application/queries/list-transactions/list-transactions.handler';
import { TRANSACTION_PDF_SERVICE } from './application/tokens/transaction-pdf-service.token';
import { ACCOUNTING_REPOSITORY } from './domain/tokens/accounting-repository.token';
import { AccountingTransactionOrmEntity } from './infrastructure/entities/accounting-transaction.orm-entity';
import { AccountingTypeOrmRepository } from './infrastructure/repositories/accounting.typeorm-repository';
import { TransactionPdfService } from './infrastructure/services/transaction-pdf.service';
import { AccountingController } from './presentation/controllers/accounting.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([AccountingTransactionOrmEntity]),
    OrganizationModule,
  ],
  controllers: [AccountingController],
  providers: [
    CreateTransactionHandler,
    GetTransactionHandler,
    ListTransactionsHandler,
    { provide: ACCOUNTING_REPOSITORY, useClass: AccountingTypeOrmRepository },
    { provide: TRANSACTION_PDF_SERVICE, useClass: TransactionPdfService },
  ],
})
export class AccountingModule {}
