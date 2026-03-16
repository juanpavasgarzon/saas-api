import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { ConflictError } from '@core/domain/errors/conflict.error';

import { type IProductRepository } from '../../../domain/contracts/product-repository.contract';
import { Product } from '../../../domain/entities/product.entity';
import { PRODUCT_REPOSITORY } from '../../../domain/tokens/product-repository.token';
import { CreateProductCommand } from './create-product.command';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler implements ICommandHandler<CreateProductCommand, string> {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(command: CreateProductCommand): Promise<string> {
    const exists = await this.productRepository.existsBySku(command.sku, command.tenantId);
    if (exists) {
      throw new ConflictError(`Product with SKU "${command.sku}" already exists`);
    }

    const product = Product.create(
      command.tenantId,
      command.name,
      command.sku,
      command.description,
      command.unit,
      command.category,
    );

    await this.productRepository.save(product);
    return product.id;
  }
}
