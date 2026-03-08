import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateProductHandler } from './application/commands/create-product/create-product.handler';
import { DeactivateProductHandler } from './application/commands/deactivate-product/deactivate-product.handler';
import { ReactivateProductHandler } from './application/commands/reactivate-product/reactivate-product.handler';
import { UpdateProductHandler } from './application/commands/update-product/update-product.handler';
import { GetProductHandler } from './application/queries/get-product/get-product.handler';
import { ListProductsHandler } from './application/queries/list-products/list-products.handler';
import { PRODUCT_REPOSITORY } from './domain/tokens/product-repository.token';
import { ProductOrmEntity } from './infrastructure/entities/product.orm-entity';
import { ProductTypeOrmRepository } from './infrastructure/repositories/product.typeorm-repository';
import { ProductsController } from './presentation/controllers/products.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([ProductOrmEntity])],
  controllers: [ProductsController],
  providers: [
    CreateProductHandler,
    UpdateProductHandler,
    DeactivateProductHandler,
    ReactivateProductHandler,
    GetProductHandler,
    ListProductsHandler,
    { provide: PRODUCT_REPOSITORY, useClass: ProductTypeOrmRepository },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class ProductsModule {}
