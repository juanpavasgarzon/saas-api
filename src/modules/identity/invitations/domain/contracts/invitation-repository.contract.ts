import { type PaginatedResult } from '@core/index';

import { type Invitation } from '../entities/invitation.entity';

export interface IInvitationRepository {
  findByToken(token: string): Promise<Invitation | null>;
  findByTenantAndEmail(tenantId: string, email: string): Promise<Invitation | null>;
  findAll(tenantId: string, page: number, limit: number): Promise<PaginatedResult<Invitation>>;
  save(invitation: Invitation): Promise<void>;
}
