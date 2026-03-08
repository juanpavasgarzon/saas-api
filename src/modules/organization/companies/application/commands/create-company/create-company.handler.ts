import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ICompanyRepository } from '../../../domain/contracts/company-repository.contract';
import { Company } from '../../../domain/entities/company.entity';
import { CompanySlugTakenError } from '../../../domain/errors/company-slug-taken.error';
import { COMPANY_REPOSITORY } from '../../../domain/tokens/company-repository.token';
import { CreateCompanyCommand } from './create-company.command';

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyHandler implements ICommandHandler<CreateCompanyCommand, string> {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(command: CreateCompanyCommand): Promise<string> {
    const company = Company.create(command.name);
    const existing = await this.companyRepository.findBySlug(company.slug);
    if (existing) {
      throw new CompanySlugTakenError(company.slug);
    }

    await this.companyRepository.save(company);

    return company.id;
  }
}
