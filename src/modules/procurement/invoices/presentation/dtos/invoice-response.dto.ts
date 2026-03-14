import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Invoice } from '../../domain/entities/invoice.entity';
import { InvoiceStatus } from '../../domain/enums/invoice-status.enum';

export class SupplierInvoiceResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 1 })
  number: number;

  @ApiProperty({ example: 'INV-2025-001' })
  invoiceNumber: string;

  @ApiProperty({ example: 'uuid-of-supplier' })
  supplierId: string;

  @ApiProperty({ example: 'uuid-of-order' })
  orderId: string;

  @ApiProperty({ example: 1499.9 })
  amount: number;

  @ApiPropertyOptional({ example: '2025-06-30', nullable: true })
  dueDate: Date | null;

  @ApiProperty({ enum: InvoiceStatus, example: InvoiceStatus.PENDING })
  status: InvoiceStatus;

  @ApiPropertyOptional({ example: 'Net 30 terms', nullable: true })
  notes: string | null;

  @ApiPropertyOptional({ example: '2025-05-01T00:00:00.000Z', nullable: true })
  paidAt: Date | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(invoice: Invoice) {
    this.id = invoice.id;
    this.number = invoice.number;
    this.invoiceNumber = invoice.invoiceNumber;
    this.supplierId = invoice.supplierId;
    this.orderId = invoice.orderId;
    this.amount = invoice.amount;
    this.dueDate = invoice.dueDate;
    this.status = invoice.status;
    this.notes = invoice.notes;
    this.paidAt = invoice.paidAt;
    this.createdAt = invoice.createdAt;
    this.updatedAt = invoice.updatedAt;
  }
}
