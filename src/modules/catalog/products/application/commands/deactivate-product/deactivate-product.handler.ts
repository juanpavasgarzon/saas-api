import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProductRepository } from '../../../domain/contracts/product-repository.contract';
import { ProductNotFoundError } from '../../../domain/errors/product-not-found.error';
import { PRODUCT_REPOSITORY } from '../../../domain/tokens/product-repository.token';
import { DeactivateProductCommand } from './deactivate-product.command';

@CommandHandler(DeactivateProductCommand)
export class DeactivateProductHandler implements ICommandHandler<DeactivateProductCommand, void> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: DeactivateProductCommand): Promise<void> {
    const product = await this.productRepository.findById(command.id, command.tenantId);
    if (!product) {
      throw new ProductNotFoundError(command.id);
    }

    product.deactivate();
    await this.productRepository.save(product);
  }
}
