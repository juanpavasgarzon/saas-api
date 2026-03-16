import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EMPLOYEE_SALARY_SERVICE } from '@core/application/tokens/employee-salary.token';

import { EmployeeSalaryAdapter } from './application/adapters/employee-salary.adapter';
import { CreateEmployeeHandler } from './application/commands/create-employee/create-employee.handler';
import { DeactivateEmployeeHandler } from './application/commands/deactivate-employee/deactivate-employee.handler';
import { ReactivateEmployeeHandler } from './application/commands/reactivate-employee/reactivate-employee.handler';
import { UpdateEmployeeHandler } from './application/commands/update-employee/update-employee.handler';
import { GetEmployeeHandler } from './application/queries/get-employee/get-employee.handler';
import { ListEmployeesHandler } from './application/queries/list-employees/list-employees.handler';
import { EMPLOYEE_REPOSITORY } from './domain/tokens/employee-repository.token';
import { EmployeeOrmEntity } from './infrastructure/entities/employee.orm-entity';
import { EmployeeTypeOrmRepository } from './infrastructure/repositories/employee.typeorm-repository';
import { EmployeesController } from './presentation/controllers/employees.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([EmployeeOrmEntity])],
  controllers: [EmployeesController],
  providers: [
    CreateEmployeeHandler,
    UpdateEmployeeHandler,
    DeactivateEmployeeHandler,
    ReactivateEmployeeHandler,
    GetEmployeeHandler,
    ListEmployeesHandler,
    EmployeeSalaryAdapter,
    { provide: EMPLOYEE_REPOSITORY, useClass: EmployeeTypeOrmRepository },
    { provide: EMPLOYEE_SALARY_SERVICE, useClass: EmployeeSalaryAdapter },
  ],
  exports: [EMPLOYEE_REPOSITORY, EMPLOYEE_SALARY_SERVICE],
})
export class EmployeesModule {}
