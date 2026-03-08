import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsOptional, IsString, ValidateNested } from 'class-validator';

import { QuotationItemDto } from './quotation-item.dto';

export class UpdateQuotationDto {
  @ApiProperty({ example: 'Website redesign proposal v2' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Updated payment terms.', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string | null;

  @ApiPropertyOptional({ example: '2025-12-31', nullable: true })
  @IsOptional()
  @IsDateString()
  validUntil?: string | null;

  @ApiProperty({ type: [QuotationItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuotationItemDto)
  items: QuotationItemDto[];
}
