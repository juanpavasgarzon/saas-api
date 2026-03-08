import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CREATE_PURCHASE_ORDER_SERVICE } from '@modules/procurement/shared/tokens/create-purchase-order.token';

import { CreatePurchaseOrderAdapter } from './application/adapters/create-purchase-order.adapter';
import { CancelPurchaseOrderHandler } from './application/commands/cancel-purchase-order/cancel-purchase-order.handler';
import { ReceivePurchaseOrderHandler } from './application/commands/receive-purchase-order/receive-purchase-order.handler';
import { PurchaseOrderReceivedEventHandler } from './application/event-handlers/purchase-order-received.event-handler';
import { GetPurchaseOrderHandler } from './application/queries/get-purchase-order/get-purchase-order.handler';
import { ListPurchaseOrdersHandler } from './application/queries/list-purchase-orders/list-purchase-orders.handler';
import { PURCHASE_ORDER_REPOSITORY } from './domain/tokens/purchase-order-repository.token';
import { PurchaseOrderOrmEntity } from './infrastructure/entities/purchase-order.orm-entity';
import { PurchaseOrderItemOrmEntity } from './infrastructure/entities/purchase-order-item.orm-entity';
import { PurchaseOrderTypeOrmRepository } from './infrastructure/repositories/purchase-order.typeorm-repository';
import { PurchaseOrdersController } from './presentation/controllers/purchase-orders.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([PurchaseOrderOrmEntity, PurchaseOrderItemOrmEntity]),
  ],
  controllers: [PurchaseOrdersController],
  providers: [
    ReceivePurchaseOrderHandler,
    CancelPurchaseOrderHandler,
    GetPurchaseOrderHandler,
    ListPurchaseOrdersHandler,
    PurchaseOrderReceivedEventHandler,
    CreatePurchaseOrderAdapter,
    { provide: PURCHASE_ORDER_REPOSITORY, useClass: PurchaseOrderTypeOrmRepository },
    { provide: CREATE_PURCHASE_ORDER_SERVICE, useClass: CreatePurchaseOrderAdapter },
  ],
  exports: [CREATE_PURCHASE_ORDER_SERVICE],
})
export class PurchaseOrdersModule {}
