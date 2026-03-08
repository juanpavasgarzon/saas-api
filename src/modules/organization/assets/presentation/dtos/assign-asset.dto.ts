import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class AssignAssetDto {
  @ApiProperty({ description: 'Project UUID to assign asset to', required: false })
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @ApiProperty({ description: 'Employee UUID to assign asset to', required: false })
  @IsOptional()
  @IsUUID()
  employeeId?: string;
}
