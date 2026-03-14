import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Not, Repository } from 'typeorm';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type ProspectFilters } from '../../domain/contracts/prospect-filters.contract';
import { type ProspectProps } from '../../domain/contracts/prospect-props.contract';
import { type IProspectRepository } from '../../domain/contracts/prospect-repository.contract';
import { Prospect } from '../../domain/entities/prospect.entity';
import { ProspectStatus } from '../../domain/enums/prospect-status.enum';
import { ProspectOrmEntity } from '../entities/prospect.orm-entity';

@Injectable()
export class ProspectTypeOrmRepository implements IProspectRepository {
  constructor(
    @InjectRepository(ProspectOrmEntity)
    private readonly repository: Repository<ProspectOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Prospect | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: ProspectFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Prospect>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.search) {
      where.name = ILike(`%${filters.search}%`);
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items: items.map((item) => this.toDomain(item)), total, page, limit };
  }

  async search(tenantId: string, search: string, limit: number): Promise<Prospect[]> {
    const where = (field: keyof ProspectOrmEntity): Record<string, unknown> => ({
      status: Not(ProspectStatus.CONVERTED),
      tenantId,
      [field]: ILike(`%${search}%`),
    });

    const items = await this.repository.find({
      where: [
        { ...where('name') },
        { ...where('identificationNumber') },
        { ...where('contactPerson') },
        { ...where('company') },
      ],
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return items.map((item) => this.toDomain(item));
  }

  async save(prospect: Prospect): Promise<void> {
    await this.repository.save(this.toOrm(prospect));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  private toDomain(orm: ProspectOrmEntity): Prospect {
    const props: ProspectProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      name: orm.name,
      email: orm.email,
      phone: orm.phone,
      company: orm.company,
      identificationNumber: orm.identificationNumber,
      address: orm.address,
      contactPerson: orm.contactPerson,
      source: orm.source,
      status: orm.status,
      notes: orm.notes,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Prospect.reconstitute(props);
  }

  private toOrm(prospect: Prospect): ProspectOrmEntity {
    const orm = new ProspectOrmEntity();
    orm.id = prospect.id;
    orm.tenantId = prospect.tenantId;
    orm.name = prospect.name;
    orm.email = prospect.email;
    orm.phone = prospect.phone;
    orm.company = prospect.company;
    orm.identificationNumber = prospect.identificationNumber;
    orm.address = prospect.address;
    orm.contactPerson = prospect.contactPerson;
    orm.source = prospect.source;
    orm.status = prospect.status;
    orm.notes = prospect.notes;
    return orm;
  }
}
