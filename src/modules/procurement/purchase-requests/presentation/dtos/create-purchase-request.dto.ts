import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { PurchaseRequestItemDto } from './purchase-request-item.dto';

export class CreatePurchaseRequestDto {
  @ApiProperty({ example: 'Office supplies Q1 2025' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'uuid-of-vendor', nullable: true })
  @IsOptional()
  @IsUUID()
  vendorId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-vendor-prospect', nullable: true })
  @IsOptional()
  @IsUUID()
  vendorProspectId?: string;

  @ApiPropertyOptional({ example: 'Urgent — needed before end of quarter.', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [PurchaseRequestItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PurchaseRequestItemDto)
  items!: PurchaseRequestItemDto[];
}
