import { ApiProperty } from '@nestjs/swagger';

import { type Invoice } from '../../domain/entities/invoice.entity';
import { type InvoiceStatus } from '../../domain/enums/invoice-status.enum';
import { InvoiceItemResponseDto } from './invoice-item-response.dto';

export class InvoiceResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() number: number;
  @ApiProperty() saleId: string;
  @ApiProperty() customerId: string;
  @ApiProperty() status: InvoiceStatus;
  @ApiProperty() notes: string | null;
  @ApiProperty() subtotal: number;
  @ApiProperty() total: number;
  @ApiProperty() sentAt: Date | null;
  @ApiProperty() paidAt: Date | null;
  @ApiProperty({ type: [InvoiceItemResponseDto] }) items: InvoiceItemResponseDto[];
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  constructor(invoice: Invoice) {
    this.id = invoice.id;
    this.number = invoice.number;
    this.saleId = invoice.saleId;
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
