import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { WorkspaceMemberRole } from '../../domain/enums/workspace-member-role.enum';

export class AddMemberDto {
  @ApiProperty({ description: 'Employee UUID to add to the project' })
  @IsUUID()
  employeeId!: string;

  @ApiPropertyOptional({
    enum: WorkspaceMemberRole,
    default: WorkspaceMemberRole.MEMBER,
    description: 'Role of the employee in the project',
  })
  @IsEnum(WorkspaceMemberRole)
  @IsOptional()
  role: WorkspaceMemberRole = WorkspaceMemberRole.MEMBER;
}
