import { ApiProperty } from '@nestjs/swagger';

import { type AuthUserData } from '@shared/application/contracts/auth-user-data.contract';

export class MeResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'owner@acme.com' })
  email: string;

  @ApiProperty({ example: 'OWNER' })
  role: string;

  constructor(user: AuthUserData) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
  }
}
