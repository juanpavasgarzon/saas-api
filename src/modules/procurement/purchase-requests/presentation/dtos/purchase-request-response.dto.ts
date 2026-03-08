import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type PurchaseRequest } from '../../domain/entities/purchase-request.entity';
import { PurchaseRequestStatus } from '../../domain/enums/purchase-request-status.enum';

export class PurchaseRequestItemResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000002' })
  id: string;

  @ApiProperty({ example: 'Office chair ergonomic' })
  description: string;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: 149.99 })
  unitPrice: number;

  @ApiProperty({ example: 1499.9 })
  lineTotal: number;

  constructor(item: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }) {
    this.id = item.id;
    this.description = item.description;
    this.quantity = item.quantity;
    this.unitPrice = item.unitPrice;
    this.lineTotal = item.lineTotal;
  }
}

export class PurchaseRequestResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Office supplies Q1 2025' })
  title: string;

  @ApiPropertyOptional({ example: 'uuid-of-vendor', nullable: true })
  vendorId: string | null;

  @ApiPropertyOptional({ example: 'uuid-of-vendor-prospect', nullable: true })
  vendorProspectId: string | null;

  @ApiProperty({ enum: PurchaseRequestStatus, example: PurchaseRequestStatus.DRAFT })
  status: PurchaseRequestStatus;

  @ApiPropertyOptional({ example: 'Urgent — needed before end of quarter.', nullable: true })
  notes: string | null;

  @ApiProperty({ example: 1499.9 })
  subtotal: number;

  @ApiProperty({ example: 1499.9 })
  total: number;

  @ApiProperty({ type: [PurchaseRequestItemResponseDto] })
  items: PurchaseRequestItemResponseDto[];

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(pr: PurchaseRequest) {
    this.id = pr.id;
    this.title = pr.title;
    this.vendorId = pr.vendorId;
    this.vendorProspectId = pr.vendorProspectId;
    this.status = pr.status;
    this.notes = pr.notes;
    this.subtotal = pr.subtotal;
    this.total = pr.total;
    this.items = pr.items.map((i) => new PurchaseRequestItemResponseDto(i));
    this.createdAt = pr.createdAt;
    this.updatedAt = pr.updatedAt;
  }
}
