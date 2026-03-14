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

import { RequisitionItemDto } from './requisition-item.dto';

export class CreateRequisitionDto {
  @ApiProperty({ example: 'Office supplies Q1 2025' })
  @IsNotEmpty()
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'uuid-of-supplier', nullable: true })
  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @ApiPropertyOptional({ example: 'uuid-of-supplier-prospect', nullable: true })
  @IsOptional()
  @IsUUID()
  supplierProspectId?: string;

  @ApiPropertyOptional({ example: 'Urgent — needed before end of quarter.', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [RequisitionItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => RequisitionItemDto)
  items!: RequisitionItemDto[];
}
