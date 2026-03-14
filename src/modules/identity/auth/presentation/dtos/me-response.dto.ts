import { ApiProperty } from '@nestjs/swagger';

import { type AuthUserData } from '@core/application/contracts/auth-user-data.contract';

export class MeResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'owner@acme.com' })
  email: string;

  @ApiProperty({ example: 'OWNER' })
  role: string;

  @ApiProperty({ example: 'acme' })
  companyName: string;

  @ApiProperty({ example: 'base64', nullable: true })
  companyLogo?: string | null;

  @ApiProperty({ example: ['main.sub.permission'] })
  permissions: string[];

  constructor(
    user: AuthUserData,
    companyName: string,
    companyLogo: string | null,
    permissions: string[],
  ) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;
    this.companyName = companyName;
    this.companyLogo = companyLogo;
    this.permissions = permissions;
  }
}
