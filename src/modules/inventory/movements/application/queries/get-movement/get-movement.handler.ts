import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type IMovementRepository } from '../../../domain/contracts/movement-repository.contract';
import { type Movement } from '../../../domain/entities/movement.entity';
import { MovementNotFoundError } from '../../../domain/errors/movement-not-found.error';
import { MOVEMENT_REPOSITORY } from '../../../domain/tokens/movement-repository.token';
import { GetMovementQuery } from './get-movement.query';

@QueryHandler(GetMovementQuery)
export class GetMovementHandler implements IQueryHandler<GetMovementQuery, Movement> {
  constructor(
    @Inject(MOVEMENT_REPOSITORY)
    private readonly movementRepository: IMovementRepository,
  ) {}

  async execute(query: GetMovementQuery): Promise<Movement> {
    const movement = await this.movementRepository.findById(query.id, query.tenantId);
    if (!movement) {
      throw new MovementNotFoundError(query.id);
    }
    return movement;
  }
}
