import { ApiProperty } from '@nestjs/swagger';

import { type Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceStatus } from '../../domain/enums/invoice-status.enum';
import { InvoiceItemResponseDto } from './invoice-item-response.dto';

export class InvoiceResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 2001 })
  number: number;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  dealId: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  customerId: string;

  @ApiProperty({ enum: InvoiceStatus, example: InvoiceStatus.DRAFT })
  status: InvoiceStatus;

  @ApiProperty({ example: 'Net 30 payment terms', nullable: true })
  notes: string | null;

  @ApiProperty({ example: 1500.0 })
  subtotal: number;

  @ApiProperty({ example: 1500.0 })
  total: number;

  @ApiProperty({ example: '2024-01-20T10:00:00.000Z', nullable: true })
  sentAt: Date | null;

  @ApiProperty({ example: '2024-02-20T10:00:00.000Z', nullable: true })
  paidAt: Date | null;

  @ApiProperty({ type: [InvoiceItemResponseDto] })
  items: InvoiceItemResponseDto[];

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  updatedAt: Date;

  constructor(invoice: Invoice) {
    this.id = invoice.id;
    this.number = invoice.number;
    this.dealId = invoice.dealId;
    this.customerId = invoice.customerId;
    this.status = invoice.status;
    this.notes = invoice.notes;
    this.subtotal = invoice.subtotal;
    this.total = invoice.total;
    this.sentAt = invoice.sentAt;
    this.paidAt = invoice.paidAt;
    this.items = invoice.items.map((i) => new InvoiceItemResponseDto(i));
    this.createdAt = invoice.createdAt;
    this.updatedAt = invoice.updatedAt;
  }
}
