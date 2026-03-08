import { ApiProperty } from '@nestjs/swagger';

import { type TokenPair } from '../../application/contracts/token-pair.contract';

export class TokenResponseDto {
  @ApiProperty({ description: 'Access JWT (expires in 15 min)' })
  accessToken: string;

  @ApiProperty({ description: 'Refresh JWT (expires in 7 days)' })
  refreshToken: string;

  constructor(pair: TokenPair) {
    this.accessToken = pair.accessToken;
    this.refreshToken = pair.refreshToken;
  }
}
