import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

import { QuotationItemDto } from './quotation-item.dto';

export class CreateQuotationDto {
  @ApiProperty({ example: 'Website redesign proposal' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'uuid-of-customer', nullable: true })
  @IsOptional()
  @IsUUID()
  customerId?: string | null;

  @ApiPropertyOptional({ example: 'uuid-of-prospect', nullable: true })
  @IsOptional()
  @IsUUID()
  prospectId?: string | null;

  @ApiPropertyOptional({ example: 'Payment due within 30 days.', nullable: true })
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
  items!: QuotationItemDto[];
}
