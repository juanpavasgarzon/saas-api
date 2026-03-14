import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type StockProps } from '../../domain/contracts/stock-props.contract';
import {
  type IStockRepository,
  type StockFilters,
} from '../../domain/contracts/stock-repository.contract';
import { Stock } from '../../domain/entities/stock.entity';
import { StockOrmEntity } from '../entities/stock.orm-entity';

@Injectable()
export class StockTypeOrmRepository implements IStockRepository {
  constructor(
    @InjectRepository(StockOrmEntity)
    private readonly repository: Repository<StockOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Stock | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByProductAndWarehouse(
    productId: string,
    warehouseId: string,
    tenantId: string,
  ): Promise<Stock | null> {
    const orm = await this.repository.findOne({ where: { productId, warehouseId, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: StockFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Stock>> {
    const where: Record<string, unknown> = { tenantId };

    if (filters.productId) {
      where.productId = filters.productId;
    }

    if (filters.warehouseId) {
      where.warehouseId = filters.warehouseId;
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

  async findAllByProduct(productId: string, tenantId: string): Promise<Stock[]> {
    const items = await this.repository.find({ where: { productId, tenantId } });
    return items.map((item) => this.toDomain(item));
  }

  async save(stock: Stock): Promise<void> {
    await this.repository.save(this.toOrm(stock));
  }

  private toDomain(orm: StockOrmEntity): Stock {
    const props: StockProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      productId: orm.productId,
      warehouseId: orm.warehouseId,
      quantity: Number(orm.quantity),
      reservedQuantity: Number(orm.reservedQuantity),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Stock.reconstitute(props);
  }

  private toOrm(stock: Stock): StockOrmEntity {
    const orm = new StockOrmEntity();
    orm.id = stock.id;
    orm.tenantId = stock.tenantId;
    orm.productId = stock.productId;
    orm.warehouseId = stock.warehouseId;
    orm.quantity = stock.quantity;
    orm.reservedQuantity = stock.reservedQuantity;
    return orm;
  }
}
