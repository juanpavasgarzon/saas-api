import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '@shared/domain/enums/user-role.enum';

import { Invitation } from '../../domain/entities/invitation.entity';

export class InvitationResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Admin' })
  role: UserRole;

  @ApiProperty({ example: '2024-12-31T23:59:59Z' })
  expiresAt: Date;

  constructor(invitation: Invitation) {
    this.id = invitation.id;
    this.email = invitation.email;
    this.role = invitation.role as UserRole;
    this.expiresAt = invitation.expiresAt;
  }
}
