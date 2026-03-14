import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { IEmployeeRepository } from '../../../domain/contracts/employee-repository.contract';
import { Employee } from '../../../domain/entities/employee.entity';
import { EmployeeNotFoundError } from '../../../domain/errors/employee-not-found.error';
import { EMPLOYEE_REPOSITORY } from '../../../domain/tokens/employee-repository.token';
import { GetEmployeeQuery } from './get-employee.query';

@QueryHandler(GetEmployeeQuery)
export class GetEmployeeHandler implements IQueryHandler<GetEmployeeQuery, Employee> {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(query: GetEmployeeQuery): Promise<Employee> {
    const employee = await this.employeeRepository.findById(query.employeeId, query.tenantId);
    if (!employee) {
      throw new EmployeeNotFoundError(query.employeeId);
    }

    return employee;
  }
}
