import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ISupplierRepository } from '../../../domain/contracts/supplier-repository.contract';
import { Supplier } from '../../../domain/entities/supplier.entity';
import { SUPPLIER_REPOSITORY } from '../../../domain/tokens/supplier-repository.token';
import { CreateSupplierCommand } from './create-supplier.command';

@CommandHandler(CreateSupplierCommand)
export class CreateSupplierHandler implements ICommandHandler<CreateSupplierCommand, string> {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(command: CreateSupplierCommand): Promise<string> {
    const supplier = Supplier.create(
      command.tenantId,
      command.name,
      command.email,
      command.phone,
      command.identificationNumber,
      command.address,
      command.company,
      command.contactPerson,
    );
    await this.supplierRepository.save(supplier);
    return supplier.id;
  }
}
