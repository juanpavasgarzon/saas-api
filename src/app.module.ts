import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { ScheduleModule } from '@nestjs/schedule';

import { ConfigModule } from './core/infrastructure/config/config.module';
import { DatabaseModule } from './core/infrastructure/database/database.module';
import { EmailModule } from './core/infrastructure/email/email.module';
import { RabbitMQModule } from './core/infrastructure/messaging/rabbitmq.module';
import { OutboxModule } from './core/infrastructure/outbox/outbox.module';
import { JwtAuthGuard } from './core/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from './core/presentation/guards/permissions.guard';
import { CrmModule } from './modules/crm/crm.module';
import { FinanceModule } from './modules/finance/finance.module';
import { IdentityModule } from './modules/identity/identity.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SalesModule } from './modules/sales/sales.module';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    RabbitMQModule,
    OutboxModule,
    EmailModule,
    IdentityModule,
    OrganizationModule,
    CrmModule,
    ProjectsModule,
    FinanceModule,
    SalesModule,
    ProcurementModule,
    InventoryModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
