import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type ProductProps } from '../../domain/contracts/product-props.contract';
import {
  type IProductRepository,
  type ProductFilters,
} from '../../domain/contracts/product-repository.contract';
import { Product } from '../../domain/entities/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Product | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: ProductFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Product>> {
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

  async existsBySku(sku: string, tenantId: string): Promise<boolean> {
    return this.repository.exists({ where: { sku: sku.toUpperCase().trim(), tenantId } });
  }

  async save(product: Product): Promise<void> {
    await this.repository.save(this.toOrm(product));
  }

  private toDomain(orm: ProductOrmEntity): Product {
    const props: ProductProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      name: orm.name,
      sku: orm.sku,
      description: orm.description,
      unit: orm.unit,
      category: orm.category,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Product.reconstitute(props);
  }

  private toOrm(product: Product): ProductOrmEntity {
    const orm = new ProductOrmEntity();
    orm.id = product.id;
    orm.tenantId = product.tenantId;
    orm.name = product.name;
    orm.sku = product.sku;
    orm.description = product.description;
    orm.unit = product.unit;
    orm.category = product.category;
    orm.isActive = product.isActive;
    return orm;
  }
}
