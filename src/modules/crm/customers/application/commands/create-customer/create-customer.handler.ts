import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CustomerRepository } from '../../../domain/contracts/customer-repository.contract';
import { Customer } from '../../../domain/entities/customer.entity';
import { CustomerEmailAlreadyExistsError } from '../../../domain/errors/customer-email-already-exists.error';
import { CUSTOMER_REPOSITORY } from '../../../domain/tokens/customer-repository.token';
import { CreateCustomerCommand } from './create-customer.command';

@CommandHandler(CreateCustomerCommand)
export class CreateCustomerHandler implements ICommandHandler<CreateCustomerCommand, string> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: CreateCustomerCommand): Promise<string> {
    const exists = await this.customerRepository.existsByEmail(command.email, command.tenantId);
    if (exists) {
      throw new CustomerEmailAlreadyExistsError(command.email);
    }

    const customer = Customer.create(
      command.tenantId,
      command.name,
      command.email,
      command.phone,
      command.address,
      command.contactPerson,
    );

    await this.customerRepository.save(customer);
    return customer.id;
  }
}
