import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPositive, IsString, Min } from 'class-validator';

export class PurchaseRequestItemDto {
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
