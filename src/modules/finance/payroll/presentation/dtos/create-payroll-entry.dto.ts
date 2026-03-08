import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreatePayrollEntryDto {
  @ApiProperty({
    example: '019542ab-1234-7abc-8def-000000000002',
    description: 'Employee ID',
  })
  @IsUUID()
  employeeId!: string;

  @ApiProperty({ example: '2025-03', description: 'Payroll period (YYYY-MM)' })
  @IsString()
  period!: string;

  @ApiProperty({ example: 22, description: 'Number of days worked' })
  @IsInt()
  @Min(0)
  @Max(31)
  daysWorked!: number;

  @ApiProperty({
    example: 25000,
    minimum: 0,
    description: 'Base salary for the period',
  })
  @IsNumber()
  @Min(0)
  baseSalary!: number;

  @ApiPropertyOptional({
    example: 2000,
    minimum: 0,
    default: 0,
    description: 'Additional bonuses',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  bonuses?: number;

  @ApiPropertyOptional({
    example: 500,
    minimum: 0,
    default: 0,
    description: 'Deductions (taxes, insurance, etc.)',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  deductions?: number;
}
