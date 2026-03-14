import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Requisition } from '../../domain/entities/requisition.entity';
import { RequisitionStatus } from '../../domain/enums/requisition-status.enum';

export class RequisitionItemResponseDto {
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

export class RequisitionResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Office supplies Q1 2025' })
  title: string;

  @ApiPropertyOptional({ example: 'uuid-of-supplier', nullable: true })
  supplierId: string | null;

  @ApiPropertyOptional({ example: 'uuid-of-supplier-prospect', nullable: true })
  supplierProspectId: string | null;

  @ApiProperty({ enum: RequisitionStatus, example: RequisitionStatus.DRAFT })
  status: RequisitionStatus;

  @ApiPropertyOptional({ example: 'Urgent — needed before end of quarter.', nullable: true })
  notes: string | null;

  @ApiProperty({ example: 1499.9 })
  subtotal: number;

  @ApiProperty({ example: 1499.9 })
  total: number;

  @ApiProperty({ type: [RequisitionItemResponseDto] })
  items: RequisitionItemResponseDto[];

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(pr: Requisition) {
    this.id = pr.id;
    this.title = pr.title;
    this.supplierId = pr.supplierId;
    this.supplierProspectId = pr.supplierProspectId;
    this.status = pr.status;
    this.notes = pr.notes;
    this.subtotal = pr.subtotal;
    this.total = pr.total;
    this.items = pr.items.map((i) => new RequisitionItemResponseDto(i));
    this.createdAt = pr.createdAt;
    this.updatedAt = pr.updatedAt;
  }
}
