import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateSupplierProspectDto {
  @ApiProperty({ example: 'Tech Parts Co.' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'info@techparts.com', nullable: true })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1-555-000-9876', nullable: true })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Tech Parts Co.', nullable: true })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: '123456789', nullable: true })
  @IsOptional()
  @IsString()
  identificationNumber?: string;

  @ApiPropertyOptional({ example: '100 Industrial Ave', nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'John Smith', nullable: true })
  @IsOptional()
  @IsString()
  contactPerson?: string;

  @ApiPropertyOptional({ example: 'Follow up next week.', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
