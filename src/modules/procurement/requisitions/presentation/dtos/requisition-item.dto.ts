import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Min } from 'class-validator';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';

export class RequisitionItemDto {
  @ApiProperty({ enum: LineItemType, example: LineItemType.PRODUCT })
  @IsEnum(LineItemType)
  itemType!: LineItemType;

  @ApiProperty({ example: 'uuid-of-product-or-service' })
  @IsUUID()
  itemId!: string;

  @ApiProperty({ example: 'Office chair ergonomic' })
  @IsNotEmpty()
  @IsString()
  description!: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsPositive()
  quantity!: number;

  @ApiProperty({ example: 149.99 })
  @IsNumber()
  @Min(0)
  unitPrice!: number;
}
