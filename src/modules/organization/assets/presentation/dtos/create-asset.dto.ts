import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { AssetCategory } from '../../domain/enums/asset-category.enum';

export class CreateAssetDto {
  @ApiProperty({ example: 'Dell Laptop XPS 15' })
  @IsString()
  name: string;

  @ApiProperty({ enum: AssetCategory })
  @IsEnum(AssetCategory)
  category: AssetCategory;

  @ApiProperty({ example: 'SN-12345', required: false })
  @IsOptional()
  @IsString()
  serialNumber?: string;

  @ApiProperty({ example: 'High-performance laptop for development', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '2025-01-15', required: false })
  @IsOptional()
  @IsDateString()
  purchaseDate?: string;

  @ApiProperty({ example: 1500.0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  purchaseValue?: number;
}
