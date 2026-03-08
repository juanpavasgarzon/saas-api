import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ example: 'Widget A Updated', description: 'Product name' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ example: 'An updated high-quality widget', nullable: true })
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
