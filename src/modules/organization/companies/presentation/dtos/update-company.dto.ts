import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateCompanyDto {
  @ApiPropertyOptional({ example: 'Acme Corp' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png', nullable: true })
  @IsOptional()
  @IsUrl()
  logo?: string | null;
}
