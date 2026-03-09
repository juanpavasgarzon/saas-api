import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesModule } from '@modules/organization/companies/companies.module';

import { ApproveSaleHandler } from './application/commands/approve-sale/approve-sale.handler';
import { CancelSaleHandler } from './application/commands/cancel-sale/cancel-sale.handler';
import { CreateSaleHandler } from './application/commands/create-sale/create-sale.handler';
import { CreateSaleFromQuotationHandler } from './application/commands/create-sale-from-quotation/create-sale-from-quotation.handler';
import { SaleApprovedEventHandler } from './application/event-handlers/sale-approved.event-handler';
import { GetSaleHandler } from './application/queries/get-sale/get-sale.handler';
import { ListSalesHandler } from './application/queries/list-sales/list-sales.handler';
import { SALE_PDF_SERVICE } from './application/tokens/sale-pdf-service.token';
import { SALE_REPOSITORY } from './domain/tokens/sale-repository.token';
import { SaleOrmEntity } from './infrastructure/entities/sale.orm-entity';
import { SaleItemOrmEntity } from './infrastructure/entities/sale-item.orm-entity';
import { SaleTypeOrmRepository } from './infrastructure/repositories/sale.typeorm-repository';
import { SalePdfService } from './infrastructure/services/sale-pdf.service';
import { SalesController } from './presentation/controllers/sales.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([SaleOrmEntity, SaleItemOrmEntity]),
    CompaniesModule,
  ],
  controllers: [SalesController],
  providers: [
    CreateSaleHandler,
    CreateSaleFromQuotationHandler,
    ApproveSaleHandler,
    CancelSaleHandler,
    GetSaleHandler,
    ListSalesHandler,
    SaleApprovedEventHandler,
    { provide: SALE_REPOSITORY, useClass: SaleTypeOrmRepository },
    { provide: SALE_PDF_SERVICE, useClass: SalePdfService },
  ],
})
export class SalesSubmoduleModule {}
