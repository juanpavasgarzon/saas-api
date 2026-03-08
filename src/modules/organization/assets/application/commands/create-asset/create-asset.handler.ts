import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IAssetRepository } from '../../../domain/contracts/asset-repository.contract';
import { Asset } from '../../../domain/entities/asset.entity';
import { ASSET_REPOSITORY } from '../../../domain/tokens/asset-repository.token';
import { CreateAssetCommand } from './create-asset.command';

@CommandHandler(CreateAssetCommand)
export class CreateAssetHandler implements ICommandHandler<CreateAssetCommand, string> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly assetRepository: IAssetRepository,
  ) {}

  async execute(command: CreateAssetCommand): Promise<string> {
    const number = await this.assetRepository.nextNumber(command.tenantId);
    const asset = Asset.create(
      command.tenantId,
      number,
      command.name,
      command.category,
      command.serialNumber,
      command.description,
      command.purchaseDate,
      command.purchaseValue,
    );
    await this.assetRepository.save(asset);
    return asset.id;
  }
}
