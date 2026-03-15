import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { WorkspaceMemberRole } from '../../domain/enums/workspace-member-role.enum';

export class WorkspaceMemberInputDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000002', description: 'Employee UUID' })
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
