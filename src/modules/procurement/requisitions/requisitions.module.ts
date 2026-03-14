import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrdersModule } from '@modules/procurement/orders/orders.module';
import { ProspectsModule } from '@modules/procurement/prospects/prospects.module';
import { SuppliersModule } from '@modules/procurement/suppliers/suppliers.module';

import { ApproveRequisitionHandler } from './application/commands/approve-requisition/approve-requisition.handler';
import { CreateRequisitionHandler } from './application/commands/create-requisition/create-requisition.handler';
import { RejectRequisitionHandler } from './application/commands/reject-requisition/reject-requisition.handler';
import { SubmitRequisitionHandler } from './application/commands/submit-requisition/submit-requisition.handler';
import { RequisitionApprovedEventHandler } from './application/event-handlers/requisition-approved.event-handler';
import { GetRequisitionHandler } from './application/queries/get-requisition/get-requisition.handler';
import { ListRequisitionsHandler } from './application/queries/list-requisitions/list-requisitions.handler';
import { REQUISITION_REPOSITORY } from './domain/tokens/requisition-repository.token';
import { RequisitionOrmEntity } from './infrastructure/entities/requisition.orm-entity';
import { RequisitionItemOrmEntity } from './infrastructure/entities/requisition-item.orm-entity';
import { RequisitionTypeOrmRepository } from './infrastructure/repositories/requisition.typeorm-repository';
import { RequisitionsController } from './presentation/controllers/requisitions.controller';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([RequisitionOrmEntity, RequisitionItemOrmEntity]),
    ProspectsModule,
    OrdersModule,
    SuppliersModule,
  ],
  controllers: [RequisitionsController],
  providers: [
    CreateRequisitionHandler,
    SubmitRequisitionHandler,
    ApproveRequisitionHandler,
    RejectRequisitionHandler,
    GetRequisitionHandler,
    ListRequisitionsHandler,
    RequisitionApprovedEventHandler,
    { provide: REQUISITION_REPOSITORY, useClass: RequisitionTypeOrmRepository },
  ],
})
export class RequisitionsModule {}
