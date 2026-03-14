import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { ProjectMemberInputDto } from './workspace-member-input.dto';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Corporate Web Portal',
    minLength: 2,
    description: 'Project name',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    example: 'Development of a corporate web portal with CMS and e-commerce',
    description: 'Detailed project description',
  })
  @IsString()
  description!: string;

  @ApiProperty({
    example: '019542ab-1234-7abc-8def-000000000001',
    description: 'Customer ID (UUID)',
  })
  @IsUUID()
  customerId!: string;

  @ApiPropertyOptional({
    example: 15000,
    minimum: 0,
    description: 'Project budget',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiPropertyOptional({
    example: '2025-02-01',
    description: 'Start date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    example: '2025-06-30',
    description: 'End date (YYYY-MM-DD)',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    type: [ProjectMemberInputDto],
    description: 'Initial project members',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberInputDto)
  members?: ProjectMemberInputDto[];
}
