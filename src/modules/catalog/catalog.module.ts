import { Module } from '@nestjs/common';

import { ProductsModule } from './products/products.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [ProductsModule, ServicesModule],
})
export class CatalogModule {}
