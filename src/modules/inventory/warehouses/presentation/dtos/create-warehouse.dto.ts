import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWarehouseDto {
  @ApiProperty({ example: 'Main Warehouse', description: 'Warehouse name' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ example: '123 Industrial Park, Springfield', nullable: true })
  @IsOptional()
  @IsString()
  location?: string;
}
