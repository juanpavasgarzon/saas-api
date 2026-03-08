import { ApiProperty } from '@nestjs/swagger';

import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

import { type QuotationItem } from '../../domain/entities/quotation-item.entity';

export class QuotationItemResponseDto {
  @ApiProperty({ example: '019542ab-0000-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Web development — homepage' })
  description: string;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: 'UNIT' })
  unit: UnitOfMeasure;

  @ApiProperty({ example: 150.0 })
  unitPrice: number;

  @ApiProperty({ example: 1500.0 })
  lineTotal: number;

  constructor(item: QuotationItem) {
    this.id = item.id;
    this.description = item.description;
    this.quantity = item.quantity;
    this.unit = item.unit;
    this.unitPrice = item.unitPrice;
    this.lineTotal = item.lineTotal;
  }
}
