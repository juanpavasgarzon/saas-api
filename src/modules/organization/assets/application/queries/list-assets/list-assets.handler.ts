import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type IAssetRepository } from '../../../domain/contracts/asset-repository.contract';
import { type Asset } from '../../../domain/entities/asset.entity';
import { ASSET_REPOSITORY } from '../../../domain/tokens/asset-repository.token';
import { ListAssetsQuery } from './list-assets.query';

@QueryHandler(ListAssetsQuery)
export class ListAssetsHandler implements IQueryHandler<ListAssetsQuery, PaginatedResult<Asset>> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(query: ListAssetsQuery): Promise<PaginatedResult<Asset>> {
    return this.assetRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
