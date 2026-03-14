import { ApiProperty } from '@nestjs/swagger';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';

import { type DealItem } from '../../domain/entities/deal-item.entity';

export class DealItemResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ enum: LineItemType, example: LineItemType.PRODUCT })
  itemType: LineItemType;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  itemId: string;

  @ApiProperty({ example: 'Ergonomic office chair' })
  description: string;

  @ApiProperty({ example: 5 })
  quantity: number;

  @ApiProperty({ enum: UnitOfMeasure, example: UnitOfMeasure.UNIT })
  unit: UnitOfMeasure;

  @ApiProperty({ example: 299.99 })
  unitPrice: number;

  @ApiProperty({ example: 1499.95 })
  lineTotal: number;

  constructor(item: DealItem) {
    this.id = item.id;
    this.itemType = item.itemType;
    this.itemId = item.itemId;
    this.description = item.description;
    this.quantity = item.quantity;
    this.unit = item.unit;
    this.unitPrice = item.unitPrice;
    this.lineTotal = item.lineTotal;
  }
}
