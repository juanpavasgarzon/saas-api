import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IAssetRepository } from '../../../domain/contracts/asset-repository.contract';
import { AssetNotFoundError } from '../../../domain/errors/asset-not-found.error';
import { ASSET_REPOSITORY } from '../../../domain/tokens/asset-repository.token';
import { ReturnAssetCommand } from './return-asset.command';

@CommandHandler(ReturnAssetCommand)
export class ReturnAssetHandler implements ICommandHandler<ReturnAssetCommand, void> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(command: ReturnAssetCommand): Promise<void> {
    const asset = await this.assetRepository.findById(command.id, command.tenantId);
    if (!asset) {
      throw new AssetNotFoundError(command.id);
    }

    asset.return();
    await this.assetRepository.save(asset);
  }
}
