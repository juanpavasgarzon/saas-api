import { ApiProperty } from '@nestjs/swagger';

export class AcceptInvitationResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  userId: string;

  constructor(userId: string) {
    this.userId = userId;
  }
}
