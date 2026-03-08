import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Widget A', description: 'Product name' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'WGT-A-001', description: 'Unique stock-keeping unit identifier' })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiPropertyOptional({ example: 'A high-quality widget', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'UNIT', description: 'Unit of measure (e.g. UNIT, KG, L)' })
  @IsString()
  @IsNotEmpty()
  unit!: string;

  @ApiPropertyOptional({ example: 'Electronics', nullable: true })
  @IsOptional()
  @IsString()
  category?: string;
}
