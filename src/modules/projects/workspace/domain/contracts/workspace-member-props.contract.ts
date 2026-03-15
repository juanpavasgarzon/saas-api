import { type WorkspaceMemberRole } from '../enums/workspace-member-role.enum';

export interface WorkspaceMemberProps {
  id: string;
  workspaceId: string;
  tenantId: string;
  employeeId: string;
  role: WorkspaceMemberRole;
  joinedAt: Date;
}
