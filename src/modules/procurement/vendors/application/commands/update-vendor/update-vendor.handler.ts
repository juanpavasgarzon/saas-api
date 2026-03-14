import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IVendorRepository } from '../../../domain/contracts/vendor-repository.contract';
import { VendorNotFoundError } from '../../../domain/errors/vendor-not-found.error';
import { VENDOR_REPOSITORY } from '../../../domain/tokens/vendor-repository.token';
import { UpdateVendorCommand } from './update-vendor.command';

@CommandHandler(UpdateVendorCommand)
export class UpdateVendorHandler implements ICommandHandler<UpdateVendorCommand, void> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(command: UpdateVendorCommand): Promise<void> {
    const vendor = await this.vendorRepository.findById(command.vendorId, command.tenantId);
    if (!vendor) {
      throw new VendorNotFoundError();
    }

    vendor.update(
      command.name,
      command.email,
      command.phone,
      command.identificationNumber,
      command.address,
      command.company,
      command.contactPerson,
    );
    await this.vendorRepository.save(vendor);
  }
}
