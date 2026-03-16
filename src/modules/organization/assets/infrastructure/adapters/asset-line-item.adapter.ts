import { Inject, Injectable } from '@nestjs/common';

import { type ILineItemTypeAdapter } from '@core/application/contracts/line-item-type-adapter.contract';

import { type IAssetRepository } from '../../domain/contracts/asset-repository.contract';
import { ASSET_REPOSITORY } from '../../domain/tokens/asset-repository.token';

@Injectable()
export class AssetLineItemAdapter implements ILineItemTypeAdapter {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  findExistingIds(ids: string[], tenantId: string): Promise<string[]> {
    return this.assetRepository.findExistingIds(ids, tenantId);
  }
}
