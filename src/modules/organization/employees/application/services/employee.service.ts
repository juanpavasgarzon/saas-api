import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { Employee } from '../../domain/entities/employee.entity';
import { CreateEmployeeCommand } from '../commands/create-employee/create-employee.command';
import { GetEmployeeQuery } from '../queries/get-employee/get-employee.query';

@Injectable()
export class EmployeeService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async getEmployeeById(id: string, tenantId: string): Promise<Employee> {
    return this.queryBus.execute<GetEmployeeQuery, Employee>(new GetEmployeeQuery(id, tenantId));
  }

  async createEmployee(
    tenantId: string,
    firstName: string,
    lastName: string,
    email: string,
    position: string,
    department: string,
    hiredAt: Date,
    basicSalary: number,
  ): Promise<string> {
    return this.commandBus.execute<CreateEmployeeCommand, string>(
      new CreateEmployeeCommand(
        tenantId,
        firstName,
        lastName,
        email,
        position,
        department,
        hiredAt,
        basicSalary,
      ),
    );
  }
}
