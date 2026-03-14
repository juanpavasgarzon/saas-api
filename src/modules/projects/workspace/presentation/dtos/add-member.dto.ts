import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { ProjectMemberRole } from '../../domain/enums/workspace-member-role.enum';

export class AddMemberDto {
  @ApiProperty({ description: 'Employee UUID to add to the project' })
  @IsUUID()
  employeeId!: string;

  @ApiPropertyOptional({
    enum: ProjectMemberRole,
    default: ProjectMemberRole.MEMBER,
    description: 'Role of the employee in the project',
  })
  @IsEnum(ProjectMemberRole)
  @IsOptional()
  role: ProjectMemberRole = ProjectMemberRole.MEMBER;
}
