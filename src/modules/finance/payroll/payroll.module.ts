import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrganizationModule } from '@modules/organization/organization.module';

import { CreatePayrollEntryHandler } from './application/commands/create-payroll-entry/create-payroll-entry.handler';
import { MarkAsPaidHandler } from './application/commands/mark-as-paid/mark-as-paid.handler';
import { GetPayrollEntryHandler } from './application/queries/get-payroll-entry/get-payroll-entry.handler';
import { ListPayrollHandler } from './application/queries/list-payroll/list-payroll.handler';
import { PAYROLL_PDF_SERVICE } from './application/tokens/payroll-pdf-service.token';
import { PAYROLL_REPOSITORY } from './domain/tokens/payroll-repository.token';
import { PayrollEntryOrmEntity } from './infrastructure/entities/payroll-entry.orm-entity';
import { PayrollTypeOrmRepository } from './infrastructure/repositories/payroll.typeorm-repository';
import { PayrollPdfService } from './infrastructure/services/payroll-pdf.service';
import { PayrollController } from './presentation/controllers/payroll.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([PayrollEntryOrmEntity]), OrganizationModule],
  controllers: [PayrollController],
  providers: [
    CreatePayrollEntryHandler,
    MarkAsPaidHandler,
    GetPayrollEntryHandler,
    ListPayrollHandler,
    { provide: PAYROLL_REPOSITORY, useClass: PayrollTypeOrmRepository },
    { provide: PAYROLL_PDF_SERVICE, useClass: PayrollPdfService },
  ],
})
export class PayrollModule {}
