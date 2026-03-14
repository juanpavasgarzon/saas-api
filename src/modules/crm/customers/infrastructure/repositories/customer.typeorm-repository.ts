import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { CustomerFilters } from '../../domain/contracts/customer-filters.contract';
import { CustomerProps } from '../../domain/contracts/customer-props.contract';
import { ICustomerRepository } from '../../domain/contracts/customer-repository.contract';
import { Customer } from '../../domain/entities/customer.entity';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';

@Injectable()
export class CustomerTypeOrmRepository implements ICustomerRepository {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    private readonly repository: Repository<CustomerOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Customer | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByEmail(email: string, tenantId: string): Promise<Customer | null> {
    const orm = await this.repository.findOne({
      where: { email: email.toLowerCase().trim(), tenantId },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: CustomerFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Customer>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
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

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page,
      limit,
    };
  }

  async search(tenantId: string, search: string, limit: number): Promise<Customer[]> {
    const items = await this.repository.find({
      where: [
        { tenantId, name: ILike(`%${search}%`) },
        { tenantId, identificationNumber: ILike(`%${search}%`) },
        { tenantId, contactPerson: ILike(`%${search}%`) },
        { tenantId, company: ILike(`%${search}%`) },
      ],
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return items.map((item) => this.toDomain(item));
  }

  async save(customer: Customer): Promise<void> {
    await this.repository.save(this.toOrm(customer));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  async existsByEmail(email: string, tenantId: string): Promise<boolean> {
    return this.repository.exists({
      where: { email: email.toLowerCase().trim(), tenantId },
    });
  }

  private toDomain(orm: CustomerOrmEntity): Customer {
    const props: CustomerProps = {
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
    return Customer.reconstitute(props);
  }

  private toOrm(customer: Customer): CustomerOrmEntity {
    const orm = new CustomerOrmEntity();
    orm.id = customer.id;
    orm.tenantId = customer.tenantId;
    orm.name = customer.name;
    orm.email = customer.email;
    orm.phone = customer.phone;
    orm.company = customer.company;
    orm.identificationNumber = customer.identificationNumber;
    orm.address = customer.address;
    orm.contactPerson = customer.contactPerson;
    orm.isActive = customer.isActive;
    return orm;
  }
}
