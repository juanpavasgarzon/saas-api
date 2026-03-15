import { type WorkspaceMember } from '../entities/workspace-member.entity';
import { type WorkspaceStatus } from '../enums/workspace-status.enum';

export interface WorkspaceProps {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  customerId: string;
  status: WorkspaceStatus;
  budget: number | null;
  startDate: Date | null;
  endDate: Date | null;
  members: WorkspaceMember[];
  createdAt: Date;
  updatedAt: Date;
}
