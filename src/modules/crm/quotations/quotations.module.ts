import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OutboxModule } from '@core/infrastructure/outbox/outbox.module';
import { OrganizationModule } from '@modules/organization/organization.module';

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
import { QuotationExpiredEventHandler } from './application/event-handlers/quotation-expired.event-handler';
import { QuotationRejectedEventHandler } from './application/event-handlers/quotation-rejected.event-handler';
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
    OutboxModule,
    TypeOrmModule.forFeature([QuotationOrmEntity, QuotationItemOrmEntity]),
    OrganizationModule,
    CustomersModule,
    ProspectsModule,
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
    QuotationRejectedEventHandler,
    QuotationExpiredEventHandler,
    { provide: QUOTATION_PDF_SERVICE, useClass: QuotationPdfService },
    { provide: QUOTATION_REPOSITORY, useClass: QuotationTypeOrmRepository },
  ],
})
export class QuotationsModule {}
