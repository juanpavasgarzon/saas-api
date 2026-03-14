import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

import { ProspectSource } from '../../domain/enums/prospect-source.enum';

export class UpdateProspectDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'jane@example.com' })
  @IsOptional()
  @IsString()
  email?: string | null;

  @ApiPropertyOptional({ example: '+1 555 000 0000' })
  @IsOptional()
  @IsString()
  phone?: string | null;

  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsOptional()
  @IsString()
  company?: string | null;

  @ApiPropertyOptional({ example: '123456789' })
  @IsOptional()
  @IsString()
  identificationNumber?: string | null;

  @ApiPropertyOptional({ example: '100 Main St, New York, NY' })
  @IsOptional()
  @IsString()
  address?: string | null;

  @ApiPropertyOptional({ example: 'Jane Smith' })
  @IsOptional()
  @IsString()
  contactPerson?: string | null;

  @ApiPropertyOptional({ enum: ProspectSource })
  @IsOptional()
  @IsEnum(ProspectSource)
  source?: ProspectSource | null;

  @ApiPropertyOptional({ example: 'Follow up next week' })
  @IsOptional()
  @IsString()
  notes?: string | null;
}
