import { ApiProperty } from '@nestjs/swagger';

import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

import { type InvoiceItem } from '../../domain/entities/invoice-item.entity';

export class InvoiceItemResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() description: string;
  @ApiProperty() quantity: number;
  @ApiProperty() unit: UnitOfMeasure;
  @ApiProperty() unitPrice: number;
  @ApiProperty() lineTotal: number;

  constructor(item: InvoiceItem) {
    this.id = item.id;
    this.description = item.description;
    this.quantity = item.quantity;
    this.unit = item.unit;
    this.unitPrice = item.unitPrice;
    this.lineTotal = item.lineTotal;
  }
}
