import { ApiProperty } from '@nestjs/swagger';

import { type ProjectMember } from '../../domain/entities/workspace-member.entity';
import { ProjectMemberRole } from '../../domain/enums/workspace-member-role.enum';

export class ProjectMemberResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000002' })
  employeeId: string;

  @ApiProperty({ enum: ProjectMemberRole, example: ProjectMemberRole.MEMBER })
  role: ProjectMemberRole;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  joinedAt: Date;

  constructor(member: ProjectMember) {
    this.id = member.id;
    this.employeeId = member.employeeId;
    this.role = member.role;
    this.joinedAt = member.joinedAt;
  }
}
