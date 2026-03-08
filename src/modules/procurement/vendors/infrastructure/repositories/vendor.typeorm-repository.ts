import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type VendorFilters } from '../../domain/contracts/vendor-filters.contract';
import { type VendorProps } from '../../domain/contracts/vendor-props.contract';
import { type IVendorRepository } from '../../domain/contracts/vendor-repository.contract';
import { Vendor } from '../../domain/entities/vendor.entity';
import { VendorOrmEntity } from '../entities/vendor.orm-entity';

@Injectable()
export class VendorTypeOrmRepository implements IVendorRepository {
  constructor(
    @InjectRepository(VendorOrmEntity)
    private readonly repository: Repository<VendorOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Vendor | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByEmail(email: string, tenantId: string): Promise<Vendor | null> {
    const orm = await this.repository.findOne({
      where: { email: email.toLowerCase().trim(), tenantId },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: VendorFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Vendor>> {
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

  async save(vendor: Vendor): Promise<void> {
    await this.repository.save(this.toOrm(vendor));
  }

  private toDomain(orm: VendorOrmEntity): Vendor {
    const props: VendorProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      name: orm.name,
      email: orm.email,
      phone: orm.phone,
      address: orm.address,
      contactPerson: orm.contactPerson,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Vendor.reconstitute(props);
  }

  private toOrm(vendor: Vendor): VendorOrmEntity {
    const orm = new VendorOrmEntity();
    orm.id = vendor.id;
    orm.tenantId = vendor.tenantId;
    orm.name = vendor.name;
    orm.email = vendor.email;
    orm.phone = vendor.phone;
    orm.address = vendor.address;
    orm.contactPerson = vendor.contactPerson;
    orm.isActive = vendor.isActive;
    return orm;
  }
}
