import { ApiProperty } from '@nestjs/swagger';

import { type Workspace } from '../../domain/entities/workspace.entity';
import { WorkspaceStatus } from '../../domain/enums/workspace-status.enum';
import { WorkspaceMemberResponseDto } from './workspace-member-response.dto';

export class WorkspaceResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Website Redesign' })
  name: string;

  @ApiProperty({ example: 'Full redesign of the company website' })
  description: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000003' })
  customerId: string;

  @ApiProperty({ enum: WorkspaceStatus, example: WorkspaceStatus.PLANNING })
  status: WorkspaceStatus;

  @ApiProperty({ example: 50000, nullable: true })
  budget: number | null;

  @ApiProperty({ example: '2025-03-01T00:00:00.000Z', nullable: true })
  startDate: Date | null;

  @ApiProperty({ example: '2025-09-01T00:00:00.000Z', nullable: true })
  endDate: Date | null;

  @ApiProperty({ type: [WorkspaceMemberResponseDto] })
  members: WorkspaceMemberResponseDto[];

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(project: Workspace) {
    this.id = project.id;
    this.name = project.name;
    this.description = project.description;
    this.customerId = project.customerId;
    this.status = project.status;
    this.budget = project.budget;
    this.startDate = project.startDate;
    this.endDate = project.endDate;
    this.members = project.members.map((m) => new WorkspaceMemberResponseDto(m));
    this.createdAt = project.createdAt;
    this.updatedAt = project.updatedAt;
  }
}
