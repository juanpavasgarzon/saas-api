import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { EmployeeRepository } from '../../../domain/contracts/employee-repository.contract';
import { EmployeeNotFoundError } from '../../../domain/errors/employee-not-found.error';
import { EMPLOYEE_REPOSITORY } from '../../../domain/tokens/employee-repository.token';
import { ReactivateEmployeeCommand } from './reactivate-employee.command';

@CommandHandler(ReactivateEmployeeCommand)
export class ReactivateEmployeeHandler implements ICommandHandler<ReactivateEmployeeCommand> {
  constructor(
    @Inject(EMPLOYEE_REPOSITORY)
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  async execute(command: ReactivateEmployeeCommand): Promise<void> {
    const employee = await this.employeeRepository.findById(command.employeeId, command.tenantId);
    if (!employee) {
      throw new EmployeeNotFoundError(command.employeeId);
    }

    employee.activate();
    await this.employeeRepository.save(employee);
  }
}
