import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ example: 'Acme Supplies Ltd.' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'contact@acme.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: 'Acme Corporation' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: '123456789' })
  @IsOptional()
  @IsString()
  identificationNumber?: string;

  @ApiPropertyOptional({ example: '+1-555-000-1234' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Industrial Ave, Suite 4' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'John Smith' })
  @IsOptional()
  @IsString()
  contactPerson?: string;
}
