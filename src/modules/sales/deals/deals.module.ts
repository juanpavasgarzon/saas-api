import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OutboxModule } from '@core/infrastructure/outbox/outbox.module';
import { OrganizationModule } from '@modules/organization/organization.module';

import { ApproveSaleHandler } from './application/commands/approve-deal/approve-deal.handler';
import { CancelSaleHandler } from './application/commands/cancel-deal/cancel-deal.handler';
import { CreateSaleHandler } from './application/commands/create-deal/create-deal.handler';
import { CreateSaleFromQuotationHandler } from './application/commands/create-deal-from-quotation/create-deal-from-quotation.handler';
import { DealApprovedEventHandler } from './application/event-handlers/deal-approved.event-handler';
import { GetSaleHandler } from './application/queries/get-deal/get-deal.handler';
import { ListSalesHandler } from './application/queries/list-deals/list-deals.handler';
import { DEAL_PDF_SERVICE } from './application/tokens/deal-pdf-service.token';
import { DEAL_REPOSITORY } from './domain/tokens/deal-repository.token';
import { QuotationAcceptedConsumer } from './infrastructure/consumers/quotation-accepted.consumer';
import { DealOrmEntity } from './infrastructure/entities/deal.orm-entity';
import { DealItemOrmEntity } from './infrastructure/entities/deal-item.orm-entity';
import { DealTypeOrmRepository } from './infrastructure/repositories/deal.typeorm-repository';
import { DealPdfService } from './infrastructure/services/deal-pdf.service';
import { SalesController } from './presentation/controllers/deals.controller';

@Module({
  imports: [
    CqrsModule,
    OutboxModule,
    TypeOrmModule.forFeature([DealOrmEntity, DealItemOrmEntity]),
    OrganizationModule,
  ],
  controllers: [SalesController],
  providers: [
    CreateSaleHandler,
    CreateSaleFromQuotationHandler,
    ApproveSaleHandler,
    CancelSaleHandler,
    GetSaleHandler,
    ListSalesHandler,
    DealApprovedEventHandler,
    QuotationAcceptedConsumer,
    { provide: DEAL_REPOSITORY, useClass: DealTypeOrmRepository },
    { provide: DEAL_PDF_SERVICE, useClass: DealPdfService },
  ],
})
export class DealsModule {}
