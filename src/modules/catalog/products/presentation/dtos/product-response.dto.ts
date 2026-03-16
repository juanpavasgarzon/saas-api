import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Product } from '../../domain/entities/product.entity';

export class ProductResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000000' })
  tenantId: string;

  @ApiProperty({ example: 'Widget A' })
  name: string;

  @ApiProperty({ example: 'WGT-A-001' })
  sku: string;

  @ApiPropertyOptional({ example: 'A high-quality widget', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'UNIT' })
  unit: string;

  @ApiPropertyOptional({ example: 'Electronics', nullable: true })
  category: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(product: Product) {
    this.id = product.id;
    this.tenantId = product.tenantId;
    this.name = product.name;
    this.sku = product.sku;
    this.description = product.description;
    this.unit = product.unit;
    this.category = product.category;
    this.isActive = product.isActive;
    this.createdAt = product.createdAt;
    this.updatedAt = product.updatedAt;
  }
}
