import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '@shared/domain/enums/user-role.enum';

import { type User } from '../../domain/entities/user.entity';

export class UserResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'user@acme.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.email = user.email.value;
    this.role = user.role;
    this.isActive = user.isActive;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
