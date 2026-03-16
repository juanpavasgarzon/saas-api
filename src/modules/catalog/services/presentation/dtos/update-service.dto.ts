import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateServiceDto {
  @ApiProperty({ example: 'Consultoría técnica' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiPropertyOptional({ example: 'Asesoría técnica especializada', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'hora' })
  @IsString()
  @IsNotEmpty()
  unit!: string;

  @ApiPropertyOptional({ example: 'Tecnología', nullable: true })
  @IsOptional()
  @IsString()
  category?: string;
}
