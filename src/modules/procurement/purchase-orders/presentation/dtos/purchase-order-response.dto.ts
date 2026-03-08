import { ApiProperty } from '@nestjs/swagger';

import { type PurchaseOrder } from '../../domain/entities/purchase-order.entity';
import { PurchaseOrderStatus } from '../../domain/enums/purchase-order-status.enum';

export class PurchaseOrderItemResponseDto {
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

export class PurchaseOrderResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'uuid-of-purchase-request' })
  purchaseRequestId: string;

  @ApiProperty({ example: 'uuid-of-vendor' })
  vendorId: string;

  @ApiProperty({ enum: PurchaseOrderStatus, example: PurchaseOrderStatus.PENDING })
  status: PurchaseOrderStatus;

  @ApiProperty({ example: 1499.9 })
  subtotal: number;

  @ApiProperty({ example: 1499.9 })
  total: number;

  @ApiProperty({ type: [PurchaseOrderItemResponseDto] })
  items: PurchaseOrderItemResponseDto[];

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(po: PurchaseOrder) {
    this.id = po.id;
    this.purchaseRequestId = po.purchaseRequestId;
    this.vendorId = po.vendorId;
    this.status = po.status;
    this.subtotal = po.subtotal;
    this.total = po.total;
    this.items = po.items.map((i) => new PurchaseOrderItemResponseDto(i));
    this.createdAt = po.createdAt;
    this.updatedAt = po.updatedAt;
  }
}
