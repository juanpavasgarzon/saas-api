import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

import { MovementType } from '../../domain/enums/movement-type.enum';

export class RegisterMovementDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001', description: 'Product UUID' })
  @IsUUID()
  productId!: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000002', description: 'Warehouse UUID' })
  @IsUUID()
  warehouseId!: string;

  @ApiProperty({ enum: MovementType, example: MovementType.ENTRY, description: 'Movement type' })
  @IsEnum(MovementType)
  type!: MovementType;

  @ApiProperty({ example: 50, description: 'Quantity moved (must be > 0)' })
  @IsNumber()
  @Min(0.001)
  quantity!: number;

  @ApiPropertyOptional({ example: 'PO-001', nullable: true, description: 'Reference ID (sale/PO)' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  referenceId?: string;

  @ApiPropertyOptional({ example: 'Manual stock adjustment', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;
}
