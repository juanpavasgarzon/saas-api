import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IPayrollRepository } from '../../../domain/contracts/payroll-repository.contract';
import { PayrollEntryNotFoundError } from '../../../domain/errors/payroll-entry-not-found.error';
import { PAYROLL_REPOSITORY } from '../../../domain/tokens/payroll-repository.token';
import { MarkAsPaidCommand } from './mark-as-paid.command';

@CommandHandler(MarkAsPaidCommand)
export class MarkAsPaidHandler implements ICommandHandler<MarkAsPaidCommand, void> {
  constructor(
    @Inject(PAYROLL_REPOSITORY)
    private readonly payrollRepository: IPayrollRepository,
  ) {}

  async execute(command: MarkAsPaidCommand): Promise<void> {
    const entry = await this.payrollRepository.findById(command.entryId, command.tenantId);
    if (!entry) {
      throw new PayrollEntryNotFoundError(command.entryId);
    }

    entry.markAsPaid();
    await this.payrollRepository.save(entry);
  }
}
