import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

import { DealItemDto } from './deal-item.dto';

export class CreateDealDto {
  @ApiProperty({ example: '019542ab-0000-7abc-8def-000000000001' })
  @IsUUID()
  customerId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [DealItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DealItemDto)
  items: DealItemDto[];
}
