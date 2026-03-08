import { ApiProperty } from '@nestjs/swagger';

import { type Stock } from '../../domain/entities/stock.entity';

export class StockResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000000' })
  tenantId: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000002' })
  productId: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000003' })
  warehouseId: string;

  @ApiProperty({ example: 100 })
  quantity: number;

  @ApiProperty({ example: 10 })
  reservedQuantity: number;

  @ApiProperty({ example: 90 })
  availableQuantity: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(stock: Stock) {
    this.id = stock.id;
    this.tenantId = stock.tenantId;
    this.productId = stock.productId;
    this.warehouseId = stock.warehouseId;
    this.quantity = stock.quantity;
    this.reservedQuantity = stock.reservedQuantity;
    this.availableQuantity = stock.availableQuantity;
    this.createdAt = stock.createdAt;
    this.updatedAt = stock.updatedAt;
  }
}
