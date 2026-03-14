import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IEmployeeRepository } from '../../../domain/contracts/employee-repository.contract';
import { Employee } from '../../../domain/entities/employee.entity';
import { EmployeeEmailAlreadyExistsError } from '../../../domain/errors/employee-email-already-exists.error';
import { EMPLOYEE_REPOSITORY } from '../../../domain/tokens/employee-repository.token';
import { CreateEmployeeCommand } from './create-employee.command';

@CommandHandler(CreateEmployeeCommand)
export class CreateEmployeeHandler implements ICommandHandler<CreateEmployeeCommand, string> {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: IEmployeeRepository,
  ) {}

  async execute(command: CreateEmployeeCommand): Promise<string> {
    const exists = await this.employeeRepository.existsByEmail(command.email, command.tenantId);
    if (exists) {
      throw new EmployeeEmailAlreadyExistsError(command.email);
    }

    const employee = Employee.create(
      command.tenantId,
      command.firstName,
      command.lastName,
      command.email,
      command.position,
      command.department,
      command.hiredAt,
      command.basicSalary,
    );

    await this.employeeRepository.save(employee);

    return employee.id;
  }
}
