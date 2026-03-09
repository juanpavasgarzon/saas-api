import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateVendorProspectDto {
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

  @ApiPropertyOptional({ example: 'Referred by procurement team.', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
