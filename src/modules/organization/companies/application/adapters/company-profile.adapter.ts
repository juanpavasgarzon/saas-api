import { Inject, Injectable } from '@nestjs/common';

import {
  type CompanyProfile,
  type ICompanyProfileService,
} from '@shared/application/contracts/company-profile.contract';

import { type ICompanyRepository } from '../../domain/contracts/company-repository.contract';
import { COMPANY_REPOSITORY } from '../../domain/tokens/company-repository.token';

@Injectable()
export class CompanyProfileAdapter implements ICompanyProfileService {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async getProfile(tenantId: string): Promise<CompanyProfile> {
    const company = await this.companyRepository.findById(tenantId);
    if (!company) {
      return { name: '', logo: null };
    }
    return { name: company.name, logo: company.logo };
  }
}
