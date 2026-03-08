import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IAssetRepository } from '../../../domain/contracts/asset-repository.contract';
import { type Asset } from '../../../domain/entities/asset.entity';
import { AssetNotFoundError } from '../../../domain/errors/asset-not-found.error';
import { ASSET_REPOSITORY } from '../../../domain/tokens/asset-repository.token';
import { GetAssetQuery } from './get-asset.query';

@QueryHandler(GetAssetQuery)
export class GetAssetHandler implements IQueryHandler<GetAssetQuery, Asset> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(query: GetAssetQuery): Promise<Asset> {
    const asset = await this.assetRepository.findById(query.id, query.tenantId);
    if (!asset) {
      throw new AssetNotFoundError();
    }
    return asset;
  }
}
