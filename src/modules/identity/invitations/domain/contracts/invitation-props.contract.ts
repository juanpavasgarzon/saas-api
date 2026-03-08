import { type InvitationStatus } from '../enums/invitation-status.enum';

export interface InvitationProps {
  id: string;
  tenantId: string;
  email: string;
  role: string;
  token: string;
  status: InvitationStatus;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
