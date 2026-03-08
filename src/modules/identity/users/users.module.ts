import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AUTH_USER_SERVICE } from '@modules/identity/shared/tokens/auth-user-service.token';

import { AuthUserAdapter } from './application/adapters/auth-user.adapter';
import { CreateUserHandler } from './application/commands/create-user/create-user.handler';
import { DeactivateUserHandler } from './application/commands/deactivate-user/deactivate-user.handler';
import { ReactivateUserHandler } from './application/commands/reactivate-user/reactivate-user.handler';
import { GetUserHandler } from './application/queries/get-user/get-user.handler';
import { ListUsersHandler } from './application/queries/list-users/list-users.handler';
import { UserService } from './application/services/user.service';
import { HASH_SERVICE } from './application/tokens/hash-service.token';
import { USER_REPOSITORY } from './domain/tokens/user-repository.token';
import { UserOrmEntity } from './infrastructure/entities/user.orm-entity';
import { UserTypeOrmRepository } from './infrastructure/repositories/user.typeorm-repository';
import { BcryptHashService } from './infrastructure/services/bcrypt-hash.service';
import { UsersController } from './presentation/controllers/users.controller';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UsersController],
  providers: [
    CreateUserHandler,
    DeactivateUserHandler,
    ReactivateUserHandler,
    GetUserHandler,
    ListUsersHandler,
    UserService,
    AuthUserAdapter,
    { provide: USER_REPOSITORY, useClass: UserTypeOrmRepository },
    { provide: HASH_SERVICE, useClass: BcryptHashService },
    { provide: AUTH_USER_SERVICE, useClass: AuthUserAdapter },
  ],
  exports: [AUTH_USER_SERVICE, HASH_SERVICE],
})
export class UsersModule {}
