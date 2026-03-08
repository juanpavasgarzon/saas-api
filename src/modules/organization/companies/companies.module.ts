import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { COMPANY_CREATION_SERVICE } from '@shared/application/tokens/company-creation.token';
import { COMPANY_PROFILE_SERVICE } from '@shared/application/tokens/company-profile.token';

import { CompanyCreationAdapter } from './application/adapters/company-creation.adapter';
import { CompanyProfileAdapter } from './application/adapters/company-profile.adapter';
import { UpdateCompanyHandler } from './application/commands/update-company/update-company.handler';
import { GetCompanyHandler } from './application/queries/get-company/get-company.handler';
import { COMPANY_REPOSITORY } from './domain/tokens/company-repository.token';
import { CompanyOrmEntity } from './infrastructure/entities/company.orm-entity';
import { CompanyTypeOrmRepository } from './infrastructure/repositories/company.typeorm-repository';
import { CompaniesController } from './presentation/controllers/companies.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CompanyOrmEntity])],
  controllers: [CompaniesController],
  providers: [
    GetCompanyHandler,
    UpdateCompanyHandler,
    { provide: COMPANY_REPOSITORY, useClass: CompanyTypeOrmRepository },
    { provide: COMPANY_CREATION_SERVICE, useClass: CompanyCreationAdapter },
    { provide: COMPANY_PROFILE_SERVICE, useClass: CompanyProfileAdapter },
  ],
  exports: [COMPANY_REPOSITORY, COMPANY_CREATION_SERVICE, COMPANY_PROFILE_SERVICE],
})
export class CompaniesModule {}
