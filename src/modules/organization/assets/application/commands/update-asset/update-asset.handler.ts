import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IAssetRepository } from '../../../domain/contracts/asset-repository.contract';
import { AssetNotFoundError } from '../../../domain/errors/asset-not-found.error';
import { ASSET_REPOSITORY } from '../../../domain/tokens/asset-repository.token';
import { UpdateAssetCommand } from './update-asset.command';

@CommandHandler(UpdateAssetCommand)
export class UpdateAssetHandler implements ICommandHandler<UpdateAssetCommand, void> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(command: UpdateAssetCommand): Promise<void> {
    const asset = await this.assetRepository.findById(command.id, command.tenantId);
    if (!asset) {
      throw new AssetNotFoundError(command.id);
    }

    asset.update(
      command.name,
      command.category,
      command.serialNumber,
      command.description,
      command.purchaseDate,
      command.purchaseValue,
    );
    await this.assetRepository.save(asset);
  }
}
