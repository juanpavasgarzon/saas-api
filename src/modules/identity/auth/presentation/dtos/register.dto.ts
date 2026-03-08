import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'Acme Corp',
    minLength: 2,
    description: 'Company name (will be used as tenant)',
  })
  @IsString()
  @MinLength(2)
  companyName!: string;

  @ApiProperty({
    example: 'owner@acme.com',
    description: 'Owner email address (role: OWNER)',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    minLength: 8,
    description: 'Owner password',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
