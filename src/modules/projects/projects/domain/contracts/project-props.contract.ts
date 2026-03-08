import { type ProjectMember } from '../entities/project-member.entity';
import { type ProjectStatus } from '../enums/project-status.enum';

export interface ProjectProps {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  customerId: string;
  status: ProjectStatus;
  budget: number | null;
  startDate: Date | null;
  endDate: Date | null;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}
