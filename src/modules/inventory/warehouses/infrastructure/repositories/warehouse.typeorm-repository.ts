import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type WarehouseProps } from '../../domain/contracts/warehouse-props.contract';
import {
  type IWarehouseRepository,
  type WarehouseFilters,
} from '../../domain/contracts/warehouse-repository.contract';
import { Warehouse } from '../../domain/entities/warehouse.entity';
import { WarehouseOrmEntity } from '../entities/warehouse.orm-entity';

@Injectable()
export class WarehouseTypeOrmRepository implements IWarehouseRepository {
  constructor(
    @InjectRepository(WarehouseOrmEntity)
    private readonly repository: Repository<WarehouseOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Warehouse | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: WarehouseFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Warehouse>> {
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

  async save(warehouse: Warehouse): Promise<void> {
    await this.repository.save(this.toOrm(warehouse));
  }

  private toDomain(orm: WarehouseOrmEntity): Warehouse {
    const props: WarehouseProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      name: orm.name,
      location: orm.location,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Warehouse.reconstitute(props);
  }

  private toOrm(warehouse: Warehouse): WarehouseOrmEntity {
    const orm = new WarehouseOrmEntity();
    orm.id = warehouse.id;
    orm.tenantId = warehouse.tenantId;
    orm.name = warehouse.name;
    orm.location = warehouse.location;
    orm.isActive = warehouse.isActive;
    return orm;
  }
}
