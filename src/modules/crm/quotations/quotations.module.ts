import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LineItemValidatorService } from '@core/application/services/line-item-validator.service';
import { LINE_ITEM_VALIDATOR } from '@core/application/tokens/line-item-validator.token';
import { ProductsModule } from '@modules/catalog/products/products.module';
import { ServicesModule } from '@modules/catalog/services/services.module';
import { AssetsModule } from '@modules/organization/assets/assets.module';
import { CompaniesModule } from '@modules/organization/companies/companies.module';

import { CustomersModule } from '../customers/customers.module';
import { ProspectsModule } from '../prospects/prospects.module';
import { AcceptQuotationHandler } from './application/commands/accept-quotation/accept-quotation.handler';
import { CreateQuotationHandler } from './application/commands/create-quotation/create-quotation.handler';
import { DeleteQuotationHandler } from './application/commands/delete-quotation/delete-quotation.handler';
import { ExpireQuotationHandler } from './application/commands/expire-quotation/expire-quotation.handler';
import { RejectQuotationHandler } from './application/commands/reject-quotation/reject-quotation.handler';
import { SendQuotationHandler } from './application/commands/send-quotation/send-quotation.handler';
import { UpdateQuotationHandler } from './application/commands/update-quotation/update-quotation.handler';
import { QuotationAcceptedEventHandler } from './application/event-handlers/quotation-accepted.event-handler';
import { GetQuotationHandler } from './application/queries/get-quotation/get-quotation.handler';
import { ListQuotationsHandler } from './application/queries/list-quotations/list-quotations.handler';
import { QUOTATION_PDF_SERVICE } from './application/tokens/quotation-pdf-service.token';
import { QUOTATION_REPOSITORY } from './domain/tokens/quotation-repository.token';
import { QuotationOrmEntity } from './infrastructure/entities/quotation.orm-entity';
import { QuotationItemOrmEntity } from './infrastructure/entities/quotation-item.orm-entity';
import { QuotationTypeOrmRepository } from './infrastructure/repositories/quotation.typeorm-repository';
import { QuotationPdfService } from './infrastructure/services/quotation-pdf.service';
import { QuotationsController } from './presentation/controllers/quotations.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([QuotationOrmEntity, QuotationItemOrmEntity]),
    CompaniesModule,
    CustomersModule,
    ProspectsModule,
    ProductsModule,
    ServicesModule,
    AssetsModule,
  ],
  controllers: [QuotationsController],
  providers: [
    CreateQuotationHandler,
    UpdateQuotationHandler,
    SendQuotationHandler,
    AcceptQuotationHandler,
    RejectQuotationHandler,
    ExpireQuotationHandler,
    DeleteQuotationHandler,
    GetQuotationHandler,
    ListQuotationsHandler,
    QuotationAcceptedEventHandler,
    { provide: QUOTATION_PDF_SERVICE, useClass: QuotationPdfService },
    { provide: QUOTATION_REPOSITORY, useClass: QuotationTypeOrmRepository },
    { provide: LINE_ITEM_VALIDATOR, useClass: LineItemValidatorService },
  ],
})
export class QuotationsModule {}
