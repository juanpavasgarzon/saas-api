import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IUserRepository } from '../../../domain/contracts/user-repository.contract';
import { type User } from '../../../domain/entities/user.entity';
import { USER_REPOSITORY } from '../../../domain/tokens/user-repository.token';
import { ListUsersQuery } from './list-users.query';

@QueryHandler(ListUsersQuery)
export class ListUsersHandler implements IQueryHandler<ListUsersQuery, PaginatedResult<User>> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(query: ListUsersQuery): Promise<PaginatedResult<User>> {
    return this.userRepository.findAll(query.tenantId, query.page, query.limit);
  }
}
