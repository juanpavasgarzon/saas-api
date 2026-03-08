import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { CustomerRepository } from '../../../domain/contracts/customer-repository.contract';
import { Customer } from '../../../domain/entities/customer.entity';
import { CustomerNotFoundError } from '../../../domain/errors/customer-not-found.error';
import { CUSTOMER_REPOSITORY } from '../../../domain/tokens/customer-repository.token';
import { GetCustomerQuery } from './get-customer.query';

@QueryHandler(GetCustomerQuery)
export class GetCustomerHandler implements IQueryHandler<GetCustomerQuery, Customer> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(query: GetCustomerQuery): Promise<Customer> {
    const customer = await this.customerRepository.findById(query.customerId, query.tenantId);
    if (!customer) {
      throw new CustomerNotFoundError(query.customerId);
    }

    return customer;
  }
}
