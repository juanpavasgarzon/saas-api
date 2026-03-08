import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { CustomerRepository } from '../../../domain/contracts/customer-repository.contract';
import { CustomerNotFoundError } from '../../../domain/errors/customer-not-found.error';
import { CUSTOMER_REPOSITORY } from '../../../domain/tokens/customer-repository.token';
import { UpdateCustomerCommand } from './update-customer.command';

@CommandHandler(UpdateCustomerCommand)
export class UpdateCustomerHandler implements ICommandHandler<UpdateCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: CustomerRepository,
  ) {}

  async execute(command: UpdateCustomerCommand): Promise<void> {
    const customer = await this.customerRepository.findById(command.customerId, command.tenantId);
    if (!customer) {
      throw new CustomerNotFoundError(command.customerId);
    }

    customer.update(
      command.name,
      command.email,
      command.phone,
      command.address,
      command.contactPerson,
    );
    await this.customerRepository.save(customer);
  }
}
