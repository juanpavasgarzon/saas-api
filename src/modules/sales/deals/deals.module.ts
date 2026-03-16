import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LineItemValidatorService } from '@core/application/services/line-item-validator.service';
import { LINE_ITEM_VALIDATOR } from '@core/application/tokens/line-item-validator.token';
import { OutboxModule } from '@core/infrastructure/outbox/outbox.module';
import { ProductsModule } from '@modules/catalog/products/products.module';
import { ServicesModule } from '@modules/catalog/services/services.module';
import { AssetsModule } from '@modules/organization/assets/assets.module';
import { CompaniesModule } from '@modules/organization/companies/companies.module';

import { ApproveDealHandler } from './application/commands/approve-deal/approve-deal.handler';
import { CancelDealHandler } from './application/commands/cancel-deal/cancel-deal.handler';
import { CreateDealHandler } from './application/commands/create-deal/create-deal.handler';
import { CreateDealFromQuotationHandler } from './application/commands/create-deal-from-quotation/create-deal-from-quotation.handler';
import { DealApprovedEventHandler } from './application/event-handlers/deal-approved.event-handler';
import { GetDealHandler } from './application/queries/get-deal/get-deal.handler';
import { ListDealsHandler } from './application/queries/list-deals/list-deals.handler';
import { DEAL_PDF_SERVICE } from './application/tokens/deal-pdf-service.token';
import { DEAL_REPOSITORY } from './domain/tokens/deal-repository.token';
import { QuotationAcceptedConsumer } from './infrastructure/consumers/quotation-accepted.consumer';
import { DealOrmEntity } from './infrastructure/entities/deal.orm-entity';
import { DealItemOrmEntity } from './infrastructure/entities/deal-item.orm-entity';
import { DealTypeOrmRepository } from './infrastructure/repositories/deal.typeorm-repository';
import { DealPdfService } from './infrastructure/services/deal-pdf.service';
import { DealsController } from './presentation/controllers/deals.controller';

@Module({
  imports: [
    CqrsModule,
    OutboxModule,
    TypeOrmModule.forFeature([DealOrmEntity, DealItemOrmEntity]),
    CompaniesModule,
    ProductsModule,
    ServicesModule,
    AssetsModule,
  ],
  controllers: [DealsController],
  providers: [
    CreateDealHandler,
    CreateDealFromQuotationHandler,
    ApproveDealHandler,
    CancelDealHandler,
    GetDealHandler,
    ListDealsHandler,
    DealApprovedEventHandler,
    QuotationAcceptedConsumer,
    { provide: DEAL_REPOSITORY, useClass: DealTypeOrmRepository },
    { provide: DEAL_PDF_SERVICE, useClass: DealPdfService },
    { provide: LINE_ITEM_VALIDATOR, useClass: LineItemValidatorService },
  ],
})
export class DealsModule {}
