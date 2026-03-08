import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IPayrollRepository } from '../../../domain/contracts/payroll-repository.contract';
import { type PayrollEntry } from '../../../domain/entities/payroll-entry.entity';
import { PayrollEntryNotFoundError } from '../../../domain/errors/payroll-entry-not-found.error';
import { PAYROLL_REPOSITORY } from '../../../domain/tokens/payroll-repository.token';
import { GetPayrollEntryQuery } from './get-payroll-entry.query';

@QueryHandler(GetPayrollEntryQuery)
export class GetPayrollEntryHandler implements IQueryHandler<GetPayrollEntryQuery, PayrollEntry> {
  constructor(
    @Inject(PAYROLL_REPOSITORY)
    private readonly payrollRepository: IPayrollRepository,
  ) {}

  async execute(query: GetPayrollEntryQuery): Promise<PayrollEntry> {
    const entry = await this.payrollRepository.findById(query.id, query.tenantId);
    if (!entry) {
      throw new PayrollEntryNotFoundError(query.id);
    }
    return entry;
  }
}
