import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ICustomerRepository } from '../../../domain/contracts/customer-repository.contract';
import { Customer } from '../../../domain/entities/customer.entity';
import { CUSTOMER_REPOSITORY } from '../../../domain/tokens/customer-repository.token';
import { SearchCustomersQuery } from './search-customers.query';

@QueryHandler(SearchCustomersQuery)
export class SearchCustomersHandler implements IQueryHandler<SearchCustomersQuery, Customer[]> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(query: SearchCustomersQuery): Promise<Customer[]> {
    return this.customerRepository.search(query.tenantId, query.search, query.limit);
  }
}
