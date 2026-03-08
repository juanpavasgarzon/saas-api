import { ApiProperty } from '@nestjs/swagger';

export class InvitationTokenResponseDto {
  @ApiProperty({ example: 'abc123xyz...' })
  token: string;

  constructor(token: string) {
    this.token = token;
  }
}
