import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Warehouse } from '../../domain/entities/warehouse.entity';

export class WarehouseResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000000' })
  tenantId: string;

  @ApiProperty({ example: 'Main Warehouse' })
  name: string;

  @ApiPropertyOptional({ example: '123 Industrial Park, Springfield', nullable: true })
  location: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(warehouse: Warehouse) {
    this.id = warehouse.id;
    this.tenantId = warehouse.tenantId;
    this.name = warehouse.name;
    this.location = warehouse.location;
    this.isActive = warehouse.isActive;
    this.createdAt = warehouse.createdAt;
    this.updatedAt = warehouse.updatedAt;
  }
}
