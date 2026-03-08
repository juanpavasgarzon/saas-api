import { Inject, Injectable } from '@nestjs/common';

import { type ICompanyCreationService } from '@shared/application/contracts/company-creation.contract';

import { type ICompanyRepository } from '../../domain/contracts/company-repository.contract';
import { Company } from '../../domain/entities/company.entity';
import { COMPANY_REPOSITORY } from '../../domain/tokens/company-repository.token';

@Injectable()
export class CompanyCreationAdapter implements ICompanyCreationService {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async createCompany(name: string): Promise<string> {
    const company = Company.create(name);
    await this.companyRepository.save(company);
    return company.id;
  }
}
