import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class SendQuotationDto {
  @ApiPropertyOptional({
    description: 'Send the quotation PDF to the customer or prospect email',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean;
}
