import { Inject } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type IInvitationRepository } from '../../../domain/contracts/invitation-repository.contract';
import { type Invitation } from '../../../domain/entities/invitation.entity';
import { INVITATION_REPOSITORY } from '../../../domain/tokens/invitation-repository.token';
import { ListInvitationsQuery } from './list-invitations.query';

@QueryHandler(ListInvitationsQuery)
export class ListInvitationsHandler implements IQueryHandler<
  ListInvitationsQuery,
  PaginatedResult<Invitation>
> {
  constructor(
    @Inject(INVITATION_REPOSITORY)
    private readonly invitationRepository: IInvitationRepository,
  ) {}

  async execute(query: ListInvitationsQuery): Promise<PaginatedResult<Invitation>> {
    const { tenantId, page, limit } = query;
    return this.invitationRepository.findAll(tenantId, page, limit);
  }
}
