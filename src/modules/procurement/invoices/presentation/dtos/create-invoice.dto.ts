import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({ example: 'INV-2025-001', description: 'Supplier-issued invoice number' })
  @IsString()
  @IsNotEmpty()
  invoiceNumber: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001', description: 'Supplier UUID' })
  @IsUUID()
  supplierId: string;

  @ApiProperty({
    example: '019542ab-1234-7abc-8def-000000000002',
    description: 'Purchase order UUID',
  })
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: 1499.9, description: 'Total invoice amount' })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: '2025-06-30', nullable: true, description: 'Payment due date' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date | null;

  @ApiPropertyOptional({ example: 'Net 30 terms', nullable: true })
  @IsOptional()
  @IsString()
  notes?: string | null;
}
