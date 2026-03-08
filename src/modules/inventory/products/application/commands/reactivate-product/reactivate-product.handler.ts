import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IProductRepository } from '../../../domain/contracts/product-repository.contract';
import { ProductNotFoundError } from '../../../domain/errors/product-not-found.error';
import { PRODUCT_REPOSITORY } from '../../../domain/tokens/product-repository.token';
import { ReactivateProductCommand } from './reactivate-product.command';

@CommandHandler(ReactivateProductCommand)
export class ReactivateProductHandler implements ICommandHandler<ReactivateProductCommand, void> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: ReactivateProductCommand): Promise<void> {
    const product = await this.productRepository.findById(command.id, command.tenantId);
    if (!product) {
      throw new ProductNotFoundError(command.id);
    }

    product.activate();
    await this.productRepository.save(product);
  }
}
