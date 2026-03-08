import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ICompanyRepository } from '../../domain/contracts/company-repository.contract';
import { Company } from '../../domain/entities/company.entity';
import { CompanyOrmEntity } from '../entities/company.orm-entity';

@Injectable()
export class CompanyTypeOrmRepository implements ICompanyRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly repo: Repository<CompanyOrmEntity>,
  ) {}

  async findById(id: string): Promise<Company | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findBySlug(slug: string): Promise<Company | null> {
    const orm = await this.repo.findOne({ where: { slug } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(company: Company): Promise<void> {
    const orm = this.toOrm(company);
    await this.repo.save(orm);
  }

  private toDomain(orm: CompanyOrmEntity): Company {
    return Company.reconstitute({
      id: orm.id,
      name: orm.name,
      slug: orm.slug,
      plan: orm.plan,
      logo: orm.logo,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  private toOrm(company: Company): CompanyOrmEntity {
    const orm = new CompanyOrmEntity();
    orm.id = company.id;
    orm.name = company.name;
    orm.slug = company.slug;
    orm.plan = company.plan;
    orm.logo = company.logo;
    orm.isActive = company.isActive;
    orm.createdAt = company.createdAt;
    orm.updatedAt = company.updatedAt;
    return orm;
  }
}
