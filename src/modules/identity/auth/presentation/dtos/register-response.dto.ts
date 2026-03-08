import { ApiProperty } from '@nestjs/swagger';

import { type RegisterResult } from '../../application/contracts/register.contract';

export class RegisterResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  companyId: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000002' })
  userId: string;

  constructor(result: RegisterResult) {
    this.companyId = result.companyId;
    this.userId = result.userId;
  }
}
