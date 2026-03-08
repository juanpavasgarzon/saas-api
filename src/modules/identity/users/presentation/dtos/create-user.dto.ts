import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';

import { UserRole } from '../../domain/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'user@acme.com', description: 'User email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Password123!',
    minLength: 8,
    description: 'Initial password',
  })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'User role',
  })
  @IsEnum(UserRole)
  role!: UserRole;
}
