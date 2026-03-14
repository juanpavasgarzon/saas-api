import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type MovementProps } from '../../domain/contracts/movement-props.contract';
import {
  type IMovementRepository,
  type MovementFilters,
} from '../../domain/contracts/movement-repository.contract';
import { Movement } from '../../domain/entities/movement.entity';
import { MovementOrmEntity } from '../entities/movement.orm-entity';

@Injectable()
export class MovementTypeOrmRepository implements IMovementRepository {
  constructor(
    @InjectRepository(MovementOrmEntity)
    private readonly repository: Repository<MovementOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Movement | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: MovementFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Movement>> {
    const where: Record<string, unknown> = { tenantId };

    if (filters.productId) {
      where.productId = filters.productId;
    }

    if (filters.warehouseId) {
      where.warehouseId = filters.warehouseId;
    }

    if (filters.type) {
      where.type = filters.type;
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

  async save(movement: Movement): Promise<void> {
    await this.repository.save(this.toOrm(movement));
  }

  private toDomain(orm: MovementOrmEntity): Movement {
    const props: MovementProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      productId: orm.productId,
      warehouseId: orm.warehouseId,
      toWarehouseId: orm.toWarehouseId,
      type: orm.type,
      quantity: Number(orm.quantity),
      source: orm.source,
      referenceId: orm.referenceId,
      notes: orm.notes,
      createdAt: orm.createdAt,
    };
    return Movement.reconstitute(props);
  }

  private toOrm(movement: Movement): MovementOrmEntity {
    const orm = new MovementOrmEntity();
    orm.id = movement.id;
    orm.tenantId = movement.tenantId;
    orm.productId = movement.productId;
    orm.warehouseId = movement.warehouseId;
    orm.toWarehouseId = movement.toWarehouseId;
    orm.type = movement.type;
    orm.quantity = movement.quantity;
    orm.source = movement.source;
    orm.referenceId = movement.referenceId;
    orm.notes = movement.notes;
    return orm;
  }
}
