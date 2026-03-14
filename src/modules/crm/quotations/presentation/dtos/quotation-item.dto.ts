import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, IsUUID, Min } from 'class-validator';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';

export class QuotationItemDto {
  @ApiProperty({ enum: LineItemType, example: LineItemType.PRODUCT })
  @IsEnum(LineItemType)
  itemType!: LineItemType;

  @ApiProperty({ example: 'uuid-of-product-or-asset' })
  @IsUUID()
  itemId!: string;

  @ApiProperty({ example: 'Web development — homepage' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0.01)
  quantity!: number;

  @ApiProperty({ enum: UnitOfMeasure, example: UnitOfMeasure.UNIT })
  @IsEnum(UnitOfMeasure)
  unit!: UnitOfMeasure;

  @ApiProperty({ example: 150.0 })
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}
