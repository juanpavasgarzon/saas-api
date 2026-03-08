import { Module } from '@nestjs/common';

import { AccountingModule } from './accounting/accounting.module';
import { PayrollModule } from './payroll/payroll.module';

@Module({
  imports: [AccountingModule, PayrollModule],
})
export class FinanceModule {}
