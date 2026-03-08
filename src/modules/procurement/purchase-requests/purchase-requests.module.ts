import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProspectsModule } from '@modules/procurement/prospects/prospects.module';
import { PurchaseOrdersModule } from '@modules/procurement/purchase-orders/purchase-orders.module';

import { ApprovePurchaseRequestHandler } from './application/commands/approve-purchase-request/approve-purchase-request.handler';
import { CreatePurchaseRequestHandler } from './application/commands/create-purchase-request/create-purchase-request.handler';
import { RejectPurchaseRequestHandler } from './application/commands/reject-purchase-request/reject-purchase-request.handler';
import { SubmitPurchaseRequestHandler } from './application/commands/submit-purchase-request/submit-purchase-request.handler';
import { PurchaseRequestApprovedEventHandler } from './application/event-handlers/purchase-request-approved.event-handler';
import { GetPurchaseRequestHandler } from './application/queries/get-purchase-request/get-purchase-request.handler';
import { ListPurchaseRequestsHandler } from './application/queries/list-purchase-requests/list-purchase-requests.handler';
import { PURCHASE_REQUEST_REPOSITORY } from './domain/tokens/purchase-request-repository.token';
import { PurchaseRequestOrmEntity } from './infrastructure/entities/purchase-request.orm-entity';
import { PurchaseRequestItemOrmEntity } from './infrastructure/entities/purchase-request-item.orm-entity';
import { PurchaseRequestTypeOrmRepository } from './infrastructure/repositories/purchase-request.typeorm-repository';
import { PurchaseRequestsController } from './presentation/controllers/purchase-requests.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PurchaseRequestOrmEntity, PurchaseRequestItemOrmEntity]),
    ProspectsModule,
    PurchaseOrdersModule,
  ],
  controllers: [PurchaseRequestsController],
  providers: [
    CreatePurchaseRequestHandler,
    SubmitPurchaseRequestHandler,
    ApprovePurchaseRequestHandler,
    RejectPurchaseRequestHandler,
    GetPurchaseRequestHandler,
    ListPurchaseRequestsHandler,
    PurchaseRequestApprovedEventHandler,
    { provide: PURCHASE_REQUEST_REPOSITORY, useClass: PurchaseRequestTypeOrmRepository },
  ],
})
export class PurchaseRequestsModule {}
