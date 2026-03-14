import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IAssetRepository } from '../../../domain/contracts/asset-repository.contract';
import { AssetNotFoundError } from '../../../domain/errors/asset-not-found.error';
import { ASSET_REPOSITORY } from '../../../domain/tokens/asset-repository.token';
import { RetireAssetCommand } from './retire-asset.command';

@CommandHandler(RetireAssetCommand)
export class RetireAssetHandler implements ICommandHandler<RetireAssetCommand, void> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(command: RetireAssetCommand): Promise<void> {
    const asset = await this.assetRepository.findById(command.id, command.tenantId);
    if (!asset) {
      throw new AssetNotFoundError(command.id);
    }
    asset.retire();
    await this.assetRepository.save(asset);
  }
}
