import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { CustomerRepository } from '../../../domain/contracts/customer-repository.contract';
import { Customer } from '../../../domain/entities/customer.entity';
import { CUSTOMER_REPOSITORY } from '../../../domain/tokens/customer-repository.token';
import { ListCustomersQuery } from './list-customers.query';

@QueryHandler(ListCustomersQuery)
export class ListCustomersHandler implements IQueryHandler<
  ListCustomersQuery,
  PaginatedResult<Customer>
> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(query: ListCustomersQuery): Promise<PaginatedResult<Customer>> {
    return this.customerRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
