import { type ProjectMemberRole } from '../enums/project-member-role.enum';

export interface ProjectMemberProps {
  id: string;
  projectId: string;
  tenantId: string;
  employeeId: string;
  role: ProjectMemberRole;
  joinedAt: Date;
}
