import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ISupplierRepository } from '../../../domain/contracts/supplier-repository.contract';
import { SupplierNotFoundError } from '../../../domain/errors/supplier-not-found.error';
import { SUPPLIER_REPOSITORY } from '../../../domain/tokens/supplier-repository.token';
import { UpdateSupplierCommand } from './update-supplier.command';

@CommandHandler(UpdateSupplierCommand)
export class UpdateSupplierHandler implements ICommandHandler<UpdateSupplierCommand, void> {
  constructor(
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
  ) {}

  async execute(command: UpdateSupplierCommand): Promise<void> {
    const supplier = await this.supplierRepository.findById(command.supplierId, command.tenantId);
    if (!supplier) {
      throw new SupplierNotFoundError(command.supplierId);
    }

    supplier.update(
      command.name,
      command.email,
      command.phone,
      command.identificationNumber,
      command.address,
      command.company,
      command.contactPerson,
    );
    await this.supplierRepository.save(supplier);
  }
}
