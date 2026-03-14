import { ApiProperty } from '@nestjs/swagger';

import { type Deal } from '../../domain/entities/deal.entity';
import { DealStatus } from '../../domain/enums/deal-status.enum';

export class DealListResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 1001 })
  number: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  customerId: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', nullable: true })
  quotationId: string | null;

  @ApiProperty({ enum: DealStatus, example: DealStatus.PENDING })
  status: DealStatus;

  @ApiProperty({ example: 'Urgent order for Q4', nullable: true })
  notes: string | null;

  @ApiProperty({ example: 1500.0 })
  subtotal: number;

  @ApiProperty({ example: 1500.0 })
  total: number;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  updatedAt: Date;

  constructor(deal: Deal) {
    this.id = deal.id;
    this.number = deal.number;
    this.customerId = deal.customerId;
    this.quotationId = deal.quotationId;
    this.status = deal.status;
    this.notes = deal.notes;
    this.subtotal = deal.subtotal;
    this.total = deal.total;
    this.createdAt = deal.createdAt;
    this.updatedAt = deal.updatedAt;
  }
}
