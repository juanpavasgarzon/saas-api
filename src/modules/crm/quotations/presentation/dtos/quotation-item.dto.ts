import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

import { UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

export class QuotationItemDto {
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
