import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type ServiceProps } from '../../domain/contracts/service-props.contract';
import {
  type IServiceRepository,
  type ServiceFilters,
} from '../../domain/contracts/service-repository.contract';
import { Service } from '../../domain/entities/service.entity';
import { ServiceOrmEntity } from '../entities/service.orm-entity';

@Injectable()
export class ServiceTypeOrmRepository implements IServiceRepository {
  constructor(
    @InjectRepository(ServiceOrmEntity)
    private readonly repository: Repository<ServiceOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Service | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: ServiceFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Service>> {
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

  async findExistingIds(ids: string[], tenantId: string): Promise<string[]> {
    if (ids.length === 0) {
      return [];
    }
    const rows = await this.repository.find({
      select: ['id'],
      where: { id: In(ids), tenantId, isActive: true },
    });
    return rows.map((r) => r.id);
  }

  async save(service: Service): Promise<void> {
    await this.repository.save(this.toOrm(service));
  }

  private toDomain(orm: ServiceOrmEntity): Service {
    const props: ServiceProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      name: orm.name,
      description: orm.description,
      unit: orm.unit,
      category: orm.category,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Service.reconstitute(props);
  }

  private toOrm(service: Service): ServiceOrmEntity {
    const orm = new ServiceOrmEntity();
    orm.id = service.id;
    orm.tenantId = service.tenantId;
    orm.name = service.name;
    orm.description = service.description;
    orm.unit = service.unit;
    orm.category = service.category;
    orm.isActive = service.isActive;
    return orm;
  }
}
