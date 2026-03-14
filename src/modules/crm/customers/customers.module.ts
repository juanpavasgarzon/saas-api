import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CreateCustomerHandler } from './application/commands/create-customer/create-customer.handler';
import { ReactivateCustomerHandler } from './application/commands/reactivate-customer/reactivate-customer.handler';
import { DeactivateCustomerHandler } from './application/commands/update-customer/deactivate-customer.handler';
import { UpdateCustomerHandler } from './application/commands/update-customer/update-customer.handler';
import { GetCustomerHandler } from './application/queries/get-customer/get-customer.handler';
import { ListCustomersHandler } from './application/queries/list-customers/list-customers.handler';
import { SearchCustomersHandler } from './application/queries/search-customers/search-customers.handler';
import { CUSTOMER_REPOSITORY } from './domain/tokens/customer-repository.token';
import { CustomerOrmEntity } from './infrastructure/entities/customer.orm-entity';
import { CustomerTypeOrmRepository } from './infrastructure/repositories/customer.typeorm-repository';
import { CustomersController } from './presentation/controllers/customers.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([CustomerOrmEntity])],
  controllers: [CustomersController],
  providers: [
    CreateCustomerHandler,
    UpdateCustomerHandler,
    DeactivateCustomerHandler,
    ReactivateCustomerHandler,
    GetCustomerHandler,
    ListCustomersHandler,
    SearchCustomersHandler,
    { provide: CUSTOMER_REPOSITORY, useClass: CustomerTypeOrmRepository },
  ],
  exports: [CUSTOMER_REPOSITORY],
})
export class CustomersModule {}
