import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateWarehouseDto {
  @ApiProperty({ example: 'Main Warehouse Updated', description: 'Warehouse name' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ example: '456 Industrial Ave, Springfield', nullable: true })
  @IsOptional()
  @IsString()
  location?: string;
}
