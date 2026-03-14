import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type AssetAssignmentProps } from '../../domain/contracts/asset-assignment-props.contract';
import { type AssetFilters } from '../../domain/contracts/asset-filters.contract';
import { type AssetProps } from '../../domain/contracts/asset-props.contract';
import { type IAssetRepository } from '../../domain/contracts/asset-repository.contract';
import { Asset } from '../../domain/entities/asset.entity';
import { AssetOrmEntity } from '../entities/asset.orm-entity';
import { AssetAssignmentOrmEntity } from '../entities/asset-assignment.orm-entity';

@Injectable()
export class AssetTypeOrmRepository implements IAssetRepository {
  constructor(
    @InjectRepository(AssetOrmEntity)
    private readonly repository: Repository<AssetOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Asset | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: AssetFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Asset>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.category) {
      where.category = filters.category;
    }
    if (filters.search) {
      where.name = ILike(`%${filters.search}%`);
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { number: 'DESC' },
    });
    return { items: items.map((i) => this.toDomain(i)), total, page, limit };
  }

  async nextNumber(tenantId: string): Promise<number> {
    const result = await this.repository
      .createQueryBuilder('a')
      .select('MAX(a.number)', 'max')
      .where('a.tenantId = :tenantId', { tenantId })
      .getRawOne<{ max: number | null }>();

    return (result?.max ?? 0) + 1;
  }

  async save(asset: Asset): Promise<void> {
    await this.repository.save(this.toOrm(asset));
  }

  private toDomain(orm: AssetOrmEntity): Asset {
    const assignments = (orm.assignments ?? []).map(
      (a): AssetAssignmentProps => ({
        id: a.id,
        assetId: a.assetId,
        projectId: a.projectId,
        employeeId: a.employeeId,
        assignedAt: a.assignedAt,
        returnedAt: a.returnedAt,
      }),
    );

    const props: AssetProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      number: Number(orm.number),
      name: orm.name,
      category: orm.category,
      serialNumber: orm.serialNumber,
      description: orm.description,
      status: orm.status,
      purchaseDate: orm.purchaseDate,
      purchaseValue: orm.purchaseValue !== null ? Number(orm.purchaseValue) : null,
      assignments,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Asset.reconstitute(props);
  }

  private toOrm(asset: Asset): AssetOrmEntity {
    const orm = new AssetOrmEntity();
    orm.id = asset.id;
    orm.tenantId = asset.tenantId;
    orm.number = asset.number;
    orm.name = asset.name;
    orm.category = asset.category;
    orm.serialNumber = asset.serialNumber;
    orm.description = asset.description;
    orm.status = asset.status;
    orm.purchaseDate = asset.purchaseDate;
    orm.purchaseValue = asset.purchaseValue;
    orm.createdAt = asset.createdAt;
    orm.updatedAt = asset.updatedAt;
    orm.assignments = asset.assignments.map((a) => {
      const aOrm = new AssetAssignmentOrmEntity();
      aOrm.id = a.id;
      aOrm.assetId = a.assetId;
      aOrm.projectId = a.projectId;
      aOrm.employeeId = a.employeeId;
      aOrm.assignedAt = a.assignedAt;
      aOrm.returnedAt = a.returnedAt;
      return aOrm;
    });
    return orm;
  }
}
