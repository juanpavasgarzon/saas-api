import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IPayrollRepository } from '../../../domain/contracts/payroll-repository.contract';
import { PayrollEntry } from '../../../domain/entities/payroll-entry.entity';
import { PAYROLL_REPOSITORY } from '../../../domain/tokens/payroll-repository.token';
import { CreatePayrollEntryCommand } from './create-payroll-entry.command';

@CommandHandler(CreatePayrollEntryCommand)
export class CreatePayrollEntryHandler implements ICommandHandler<
  CreatePayrollEntryCommand,
  string
> {
  constructor(
    @Inject(PAYROLL_REPOSITORY)
    private readonly payrollRepository: IPayrollRepository,
  ) {}

  async execute(command: CreatePayrollEntryCommand): Promise<string> {
    const entry = PayrollEntry.create(
      command.tenantId,
      command.employeeId,
      command.period,
      command.daysWorked,
      command.baseSalary,
      command.bonuses,
      command.deductions,
    );

    await this.payrollRepository.save(entry);
    return entry.id;
  }
}
