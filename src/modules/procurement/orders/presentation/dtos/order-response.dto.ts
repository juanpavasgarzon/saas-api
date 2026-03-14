import { ApiProperty } from '@nestjs/swagger';

import { type Order } from '../../domain/entities/order.entity';
import { OrderStatus } from '../../domain/enums/order-status.enum';

export class OrderItemResponseDto {
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

export class OrderResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'uuid-of-requisition' })
  requisitionId: string;

  @ApiProperty({ example: 'uuid-of-supplier' })
  supplierId: string;

  @ApiProperty({ enum: OrderStatus, example: OrderStatus.PENDING })
  status: OrderStatus;

  @ApiProperty({ example: 1499.9 })
  subtotal: number;

  @ApiProperty({ example: 1499.9 })
  total: number;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(po: Order) {
    this.id = po.id;
    this.requisitionId = po.requisitionId;
    this.supplierId = po.supplierId;
    this.status = po.status;
    this.subtotal = po.subtotal;
    this.total = po.total;
    this.items = po.items.map((i) => new OrderItemResponseDto(i));
    this.createdAt = po.createdAt;
    this.updatedAt = po.updatedAt;
  }
}
