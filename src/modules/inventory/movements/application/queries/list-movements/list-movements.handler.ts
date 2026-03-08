import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type IMovementRepository } from '../../../domain/contracts/movement-repository.contract';
import { type Movement } from '../../../domain/entities/movement.entity';
import { MOVEMENT_REPOSITORY } from '../../../domain/tokens/movement-repository.token';
import { ListMovementsQuery } from './list-movements.query';

@QueryHandler(ListMovementsQuery)
export class ListMovementsHandler implements IQueryHandler<
  ListMovementsQuery,
  PaginatedResult<Movement>
> {
  constructor(
    @Inject(MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMovementRepository,
  ) {}

  async execute(query: ListMovementsQuery): Promise<PaginatedResult<Movement>> {
    return this.movementRepository.findAll(query.tenantId, query.filters, query.page, query.limit);
  }
}
