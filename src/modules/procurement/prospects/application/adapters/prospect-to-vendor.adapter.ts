import { Inject, Injectable } from '@nestjs/common';

import { type IProspectRepository } from '@modules/procurement/prospects/domain/contracts/prospect-repository.contract';
import { VendorProspectStatus } from '@modules/procurement/prospects/domain/enums/prospect-status.enum';
import { PROSPECT_REPOSITORY } from '@modules/procurement/prospects/domain/tokens/prospect-repository.token';
import { type IProspectToVendorService } from '@modules/procurement/shared/contracts/prospect-to-vendor.contract';
import { type IVendorRepository } from '@modules/procurement/vendors/domain/contracts/vendor-repository.contract';
import { Vendor } from '@modules/procurement/vendors/domain/entities/vendor.entity';
import { VENDOR_REPOSITORY } from '@modules/procurement/vendors/domain/tokens/vendor-repository.token';

@Injectable()
export class ProspectToVendorAdapter implements IProspectToVendorService {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
    @Inject(VENDOR_REPOSITORY)
    private readonly vendorRepository: IVendorRepository,
  ) {}

  async convert(prospectId: string, tenantId: string): Promise<string> {
    const prospect = await this.prospectRepository.findById(prospectId, tenantId);
    if (!prospect) {
      return '';
    }

    const email =
      prospect.email ?? `${prospect.name.toLowerCase().replace(/\s+/g, '.')}@unknown.com`;

    const existing = await this.vendorRepository.findByEmail(email, tenantId);
    if (existing) {
      prospect.updateStatus(VendorProspectStatus.CONVERTED);
      await this.prospectRepository.save(prospect);
      return existing.id;
    }

    const vendor = Vendor.create(
      tenantId,
      prospect.name,
      email,
      prospect.phone ?? '',
      prospect.company ?? '',
      prospect.name,
    );
    await this.vendorRepository.save(vendor);

    prospect.updateStatus(VendorProspectStatus.CONVERTED);
    await this.prospectRepository.save(prospect);
    return vendor.id;
  }
}
