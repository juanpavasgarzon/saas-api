import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateServiceDto {
  @ApiProperty({ example: 'Consultoría técnica', description: 'Service name' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ example: 'Asesoría técnica especializada', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'hora', description: 'Unit of measure (e.g. hora, día, mes, proyecto)' })
  @IsString()
  @IsNotEmpty()
  unit!: string;

  @ApiPropertyOptional({ example: 'Tecnología', nullable: true })
  @IsOptional()
  @IsString()
  category?: string;
}
