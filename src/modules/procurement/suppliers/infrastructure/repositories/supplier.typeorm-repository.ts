import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type SupplierFilters } from '../../domain/contracts/supplier-filters.contract';
import { type SupplierProps } from '../../domain/contracts/supplier-props.contract';
import { type ISupplierRepository } from '../../domain/contracts/supplier-repository.contract';
import { Supplier } from '../../domain/entities/supplier.entity';
import { SupplierOrmEntity } from '../entities/supplier.orm-entity';

@Injectable()
export class SupplierTypeOrmRepository implements ISupplierRepository {
  constructor(
    @InjectRepository(SupplierOrmEntity)
    private readonly repository: Repository<SupplierOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Supplier | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByEmail(email: string, tenantId: string): Promise<Supplier | null> {
    const orm = await this.repository.findOne({
      where: { email: email.toLowerCase().trim(), tenantId },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: SupplierFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Supplier>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.search) {
      where.name = ILike(`%${filters.search}%`);
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { name: 'ASC' },
    });

    return { items: items.map((item) => this.toDomain(item)), total, page, limit };
  }

  async save(supplier: Supplier): Promise<void> {
    await this.repository.save(this.toOrm(supplier));
  }

  private toDomain(orm: SupplierOrmEntity): Supplier {
    const props: SupplierProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      name: orm.name,
      email: orm.email,
      phone: orm.phone,
      company: orm.company,
      identificationNumber: orm.identificationNumber,
      address: orm.address,
      contactPerson: orm.contactPerson,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Supplier.reconstitute(props);
  }

  private toOrm(supplier: Supplier): SupplierOrmEntity {
    const orm = new SupplierOrmEntity();
    orm.id = supplier.id;
    orm.tenantId = supplier.tenantId;
    orm.name = supplier.name;
    orm.email = supplier.email;
    orm.phone = supplier.phone;
    orm.company = supplier.company;
    orm.identificationNumber = supplier.identificationNumber;
    orm.address = supplier.address;
    orm.contactPerson = supplier.contactPerson;
    orm.isActive = supplier.isActive;
    return orm;
  }
}
