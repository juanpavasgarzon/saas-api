import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { ICompanyRepository } from '../../../domain/contracts/company-repository.contract';
import { Company } from '../../../domain/entities/company.entity';
import { CompanyNotFoundError } from '../../../domain/errors/company-not-found.error';
import { COMPANY_REPOSITORY } from '../../../domain/tokens/company-repository.token';
import { GetCompanyQuery } from './get-company.query';

@QueryHandler(GetCompanyQuery)
export class GetCompanyHandler implements IQueryHandler<GetCompanyQuery, Company> {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(query: GetCompanyQuery): Promise<Company> {
    const company = await this.companyRepository.findById(query.id);
    if (!company) {
      throw new CompanyNotFoundError(query.id);
    }

    return company;
  }
}
