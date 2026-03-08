import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type ICompanyRepository } from '../../../domain/contracts/company-repository.contract';
import { CompanyNotFoundError } from '../../../domain/errors/company-not-found.error';
import { COMPANY_REPOSITORY } from '../../../domain/tokens/company-repository.token';
import { UpdateCompanyCommand } from './update-company.command';

@CommandHandler(UpdateCompanyCommand)
export class UpdateCompanyHandler implements ICommandHandler<UpdateCompanyCommand, void> {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: ICompanyRepository,
  ) {}

  async execute(command: UpdateCompanyCommand): Promise<void> {
    const company = await this.companyRepository.findById(command.id);
    if (!company) {
      throw new CompanyNotFoundError(command.id);
    }

    company.update(command.name, command.logo);
    await this.companyRepository.save(company);
  }
}
