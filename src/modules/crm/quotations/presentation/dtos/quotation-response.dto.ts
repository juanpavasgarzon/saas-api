import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Quotation } from '../../domain/entities/quotation.entity';
import { QuotationStatus } from '../../domain/enums/quotation-status.enum';
import { QuotationItemResponseDto } from './quotation-item-response.dto';

export class QuotationResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 1 })
  number: number;

  @ApiProperty({ example: 'Website redesign proposal' })
  title: string;

  @ApiPropertyOptional({ example: 'uuid-of-customer', nullable: true })
  customerId: string | null;

  @ApiPropertyOptional({ example: 'uuid-of-prospect', nullable: true })
  prospectId: string | null;

  @ApiProperty({ enum: QuotationStatus, example: QuotationStatus.DRAFT })
  status: QuotationStatus;

  @ApiPropertyOptional({ example: 'Payment due within 30 days.', nullable: true })
  notes: string | null;

  @ApiPropertyOptional({ example: '2025-12-31T00:00:00.000Z', nullable: true })
  validUntil: Date | null;

  @ApiProperty({ example: 1500.0 })
  subtotal: number;

  @ApiProperty({ example: 1500.0 })
  total: number;

  @ApiProperty({ type: [QuotationItemResponseDto] })
  items: QuotationItemResponseDto[];

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(quotation: Quotation) {
    this.id = quotation.id;
    this.number = quotation.number;
    this.title = quotation.title;
    this.customerId = quotation.customerId;
    this.prospectId = quotation.prospectId;
    this.status = quotation.status;
    this.notes = quotation.notes;
    this.validUntil = quotation.validUntil;
    this.subtotal = quotation.subtotal;
    this.total = quotation.total;
    this.items = quotation.items.map((i) => new QuotationItemResponseDto(i));
    this.createdAt = quotation.createdAt;
    this.updatedAt = quotation.updatedAt;
  }
}
