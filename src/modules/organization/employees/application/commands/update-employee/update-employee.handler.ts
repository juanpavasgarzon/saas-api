import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EmployeeRepository } from '../../../domain/contracts/employee-repository.contract';
import { EmployeeEmailAlreadyExistsError } from '../../../domain/errors/employee-email-already-exists.error';
import { EmployeeNotFoundError } from '../../../domain/errors/employee-not-found.error';
import { EMPLOYEE_REPOSITORY } from '../../../domain/tokens/employee-repository.token';
import { UpdateEmployeeCommand } from './update-employee.command';

@CommandHandler(UpdateEmployeeCommand)
export class UpdateEmployeeHandler implements ICommandHandler<UpdateEmployeeCommand> {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(command: UpdateEmployeeCommand): Promise<void> {
    const employee = await this.employeeRepository.findById(command.employeeId, command.tenantId);
    if (!employee) {
      throw new EmployeeNotFoundError(command.employeeId);
    }

    const normalizedEmail = command.email.toLowerCase().trim();
    if (normalizedEmail !== employee.email) {
      const emailTaken = await this.employeeRepository.existsByEmail(
        normalizedEmail,
        command.tenantId,
      );
      if (emailTaken) {
        throw new EmployeeEmailAlreadyExistsError(normalizedEmail);
      }
    }

    employee.update(
      command.firstName,
      command.lastName,
      command.email,
      command.position,
      command.department,
      command.basicSalary,
    );
    await this.employeeRepository.save(employee);
  }
}
