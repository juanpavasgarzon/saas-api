import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { EmployeeStatus } from '../../domain/enums/employee-status.enum';

export class ListEmployeesDto {
  @ApiPropertyOptional({
    example: 'Engineering',
    description: 'Filter by department',
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiPropertyOptional({
    enum: EmployeeStatus,
    description: 'Filter by employee status',
  })
  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus;

  @ApiPropertyOptional({
    example: 'John',
    description: 'Search by name or email',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 1,
    default: 1,
    minimum: 1,
    description: 'Page number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
    description: 'Items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
