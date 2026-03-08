import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { EmployeeRepository } from '../../../domain/contracts/employee-repository.contract';
import { Employee } from '../../../domain/entities/employee.entity';
import { EMPLOYEE_REPOSITORY } from '../../../domain/tokens/employee-repository.token';
import { ListEmployeesQuery } from './list-employees.query';

@QueryHandler(ListEmployeesQuery)
export class ListEmployeesHandler implements IQueryHandler<
  ListEmployeesQuery,
  PaginatedResult<Employee>
> {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(query: ListEmployeesQuery): Promise<PaginatedResult<Employee>> {
    return this.employeeRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
