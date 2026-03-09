import { Module } from '@nestjs/common';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CrmModule } from './modules/crm/crm.module';
import { FinanceModule } from './modules/finance/finance.module';
import { IdentityModule } from './modules/identity/identity.module';
import { InfrastructureModule } from './modules/infrastructure/infrastructure.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrganizationModule } from './modules/organization/organization.module';
import { ProcurementModule } from './modules/procurement/procurement.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SalesModule } from './modules/sales/sales.module';
import { OutboxModule } from './shared/infrastructure/outbox/outbox.module';
import { JwtAuthGuard } from './shared/presentation/guards/jwt-auth.guard';
import { PermissionsGuard } from './shared/presentation/guards/permissions.guard';

@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule,
    DatabaseModule,
    OutboxModule,
    IdentityModule,
    OrganizationModule,
    CrmModule,
    ProjectsModule,
    FinanceModule,
    InfrastructureModule,
    SalesModule,
    ProcurementModule,
    InventoryModule,
    RouterModule.register([
      { path: 'identity', module: IdentityModule },
      { path: 'organization', module: OrganizationModule },
      { path: 'crm', module: CrmModule },
      { path: 'projects', module: ProjectsModule },
      { path: 'finance', module: FinanceModule },
      { path: 'sales', module: SalesModule },
      { path: 'procurement', module: ProcurementModule },
      { path: 'inventory', module: InventoryModule },
    ]),
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AppModule {}
