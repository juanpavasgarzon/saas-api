import { type Invitation } from '../entities/invitation.entity';

export interface IInvitationRepository {
  findByToken(token: string): Promise<Invitation | null>;
  findByTenantAndEmail(tenantId: string, email: string): Promise<Invitation | null>;
  save(invitation: Invitation): Promise<void>;
}
