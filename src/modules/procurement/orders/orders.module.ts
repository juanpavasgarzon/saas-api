import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OutboxModule } from '@core/infrastructure/outbox/outbox.module';

import { CancelOrderHandler } from './application/commands/cancel-order/cancel-order.handler';
import { ReceiveOrderHandler } from './application/commands/receive-order/receive-order.handler';
import { OrderReceivedEventHandler } from './application/event-handlers/order-received.event-handler';
import { GetOrderHandler } from './application/queries/get-order/get-order.handler';
import { ListOrdersHandler } from './application/queries/list-orders/list-orders.handler';
import { ORDER_REPOSITORY } from './domain/tokens/order-repository.token';
import { OrderOrmEntity } from './infrastructure/entities/order.orm-entity';
import { OrderItemOrmEntity } from './infrastructure/entities/order-item.orm-entity';
import { OrderTypeOrmRepository } from './infrastructure/repositories/order.typeorm-repository';
import { OrdersController } from './presentation/controllers/orders.controller';

@Module({
  imports: [
    CqrsModule,
    OutboxModule,
    TypeOrmModule.forFeature([OrderOrmEntity, OrderItemOrmEntity]),
  ],
  controllers: [OrdersController],
  providers: [
    ReceiveOrderHandler,
    CancelOrderHandler,
    GetOrderHandler,
    ListOrdersHandler,
    OrderReceivedEventHandler,
    { provide: ORDER_REPOSITORY, useClass: OrderTypeOrmRepository },
  ],
  exports: [ORDER_REPOSITORY],
})
export class OrdersModule {}
