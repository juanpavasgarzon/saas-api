import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    example: 'Acme Corp',
    minLength: 2,
    description: 'Company name',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({
    example: 'owner@acme.com',
    description: 'Owner email address',
  })
  @IsEmail()
  ownerEmail!: string;

  @ApiProperty({
    example: 'Password123!',
    minLength: 8,
    description: 'Owner password',
  })
  @IsString()
  @MinLength(8)
  ownerPassword!: string;
}
