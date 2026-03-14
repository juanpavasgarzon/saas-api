import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsString()
  name!: string;
}
