import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Movement } from '../../domain/entities/movement.entity';
import { MovementType } from '../../domain/enums/movement-type.enum';

export class MovementResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000000' })
  tenantId: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000002' })
  productId: string;

  @ApiPropertyOptional({ example: '019542ab-1234-7abc-8def-000000000003', nullable: true })
  warehouseId: string | null;

  @ApiProperty({ enum: MovementType, example: MovementType.ENTRY })
  type: MovementType;

  @ApiProperty({ example: 50 })
  quantity: number;

  @ApiPropertyOptional({ example: 'PO-001', nullable: true })
  referenceId: string | null;

  @ApiPropertyOptional({ example: 'Manual stock adjustment', nullable: true })
  notes: string | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  constructor(movement: Movement) {
    this.id = movement.id;
    this.tenantId = movement.tenantId;
    this.productId = movement.productId;
    this.warehouseId = movement.warehouseId;
    this.type = movement.type;
    this.quantity = movement.quantity;
    this.referenceId = movement.referenceId;
    this.notes = movement.notes;
    this.createdAt = movement.createdAt;
  }
}
