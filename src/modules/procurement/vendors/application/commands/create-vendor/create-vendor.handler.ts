import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IVendorRepository } from '../../../domain/contracts/vendor-repository.contract';
import { Vendor } from '../../../domain/entities/vendor.entity';
import { VENDOR_REPOSITORY } from '../../../domain/tokens/vendor-repository.token';
import { CreateVendorCommand } from './create-vendor.command';

@CommandHandler(CreateVendorCommand)
export class CreateVendorHandler implements ICommandHandler<CreateVendorCommand, string> {
  constructor(
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async execute(command: CreateVendorCommand): Promise<string> {
    const vendor = Vendor.create(
      command.tenantId,
      command.name,
      command.email,
      command.phone,
      command.identificationNumber,
      command.address,
      command.company,
      command.contactPerson,
    );
    await this.vendorRepository.save(vendor);
    return vendor.id;
  }
}
