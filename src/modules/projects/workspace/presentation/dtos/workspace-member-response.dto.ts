import { ApiProperty } from '@nestjs/swagger';

import { type WorkspaceMember } from '../../domain/entities/workspace-member.entity';
import { WorkspaceMemberRole } from '../../domain/enums/workspace-member-role.enum';

export class WorkspaceMemberResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000002' })
  employeeId: string;

  @ApiProperty({ enum: WorkspaceMemberRole, example: WorkspaceMemberRole.MEMBER })
  role: WorkspaceMemberRole;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  joinedAt: Date;

  constructor(member: WorkspaceMember) {
    this.id = member.id;
    this.employeeId = member.employeeId;
    this.role = member.role;
    this.joinedAt = member.joinedAt;
  }
}
