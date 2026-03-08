import { ApiProperty } from '@nestjs/swagger';

export class CreatedResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}
