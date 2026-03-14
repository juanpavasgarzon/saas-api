import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';
import { type IProspectProps } from '@modules/procurement/prospects/domain/contracts/prospect-props.contract';
import { type IProspectRepository } from '@modules/procurement/prospects/domain/contracts/prospect-repository.contract';
import { Prospect } from '@modules/procurement/prospects/domain/entities/prospect.entity';
import { VendorProspectStatus } from '@modules/procurement/prospects/domain/enums/prospect-status.enum';

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
    filters: { status?: VendorProspectStatus; search?: string },
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

  async save(prospect: Prospect): Promise<void> {
    await this.repository.save(this.toOrm(prospect));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  private toDomain(orm: ProspectOrmEntity): Prospect {
    const props: IProspectProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      name: orm.name,
      email: orm.email,
      phone: orm.phone,
      company: orm.company,
      identificationNumber: orm.identificationNumber,
      address: orm.address,
      contactPerson: orm.contactPerson,
      notes: orm.notes,
      status: orm.status,
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
    orm.notes = prospect.notes;
    orm.status = prospect.status;
    return orm;
  }
}
