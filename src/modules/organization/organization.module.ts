import { Module } from '@nestjs/common';

import { AssetsModule } from './assets/assets.module';
import { CompaniesModule } from './companies/companies.module';
import { EmployeesModule } from './employees/employees.module';

@Module({
  imports: [CompaniesModule, EmployeesModule, AssetsModule],
  exports: [CompaniesModule],
})
export class OrganizationModule {}
