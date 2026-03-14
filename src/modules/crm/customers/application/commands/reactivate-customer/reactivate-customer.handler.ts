import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ICustomerRepository } from '../../../domain/contracts/customer-repository.contract';
import { CustomerNotFoundError } from '../../../domain/errors/customer-not-found.error';
import { CUSTOMER_REPOSITORY } from '../../../domain/tokens/customer-repository.token';
import { ReactivateCustomerCommand } from './reactivate-customer.command';

@CommandHandler(ReactivateCustomerCommand)
export class ReactivateCustomerHandler implements ICommandHandler<ReactivateCustomerCommand> {
  constructor(
    @Inject(CUSTOMER_REPOSITORY)
    private readonly customerRepository: ICustomerRepository,
  ) {}

  async execute(command: ReactivateCustomerCommand): Promise<void> {
    const customer = await this.customerRepository.findById(command.customerId, command.tenantId);
    if (!customer) {
      throw new CustomerNotFoundError(command.customerId);
    }

    customer.activate();
    await this.customerRepository.save(customer);
  }
}
