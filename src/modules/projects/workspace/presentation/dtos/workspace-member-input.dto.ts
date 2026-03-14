import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsUUID } from 'class-validator';

import { ProjectMemberRole } from '../../domain/enums/workspace-member-role.enum';

export class ProjectMemberInputDto {
  @ApiProperty({ example: '00000000-0000-0000-0000-000000000002', description: 'Employee UUID' })
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
