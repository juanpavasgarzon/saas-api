import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { IPayrollRepository } from '../../../domain/contracts/payroll-repository.contract';
import { PayrollEntry } from '../../../domain/entities/payroll-entry.entity';
import { PAYROLL_REPOSITORY } from '../../../domain/tokens/payroll-repository.token';
import { ListPayrollQuery } from './list-payroll.query';

@QueryHandler(ListPayrollQuery)
export class ListPayrollHandler implements IQueryHandler<
  ListPayrollQuery,
  PaginatedResult<PayrollEntry>
> {
  constructor(
    @Inject(PAYROLL_REPOSITORY)
    private readonly payrollRepository: IPayrollRepository,
  ) {}

  async execute(query: ListPayrollQuery): Promise<PaginatedResult<PayrollEntry>> {
    return this.payrollRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
