import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class CreateTransactionDto {
  @ApiProperty({
    enum: TransactionType,
    example: TransactionType.INCOME,
    description: 'Transaction type',
  })
  @IsEnum(TransactionType)
  type!: TransactionType;

  @ApiProperty({
    example: 50000,
    minimum: 0.01,
    description: 'Transaction amount',
  })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({
    example: 'Payment from Acme Tech — Web Portal project',
    description: 'Transaction description',
  })
  @IsString()
  description!: string;

  @ApiPropertyOptional({
    example: 'INV-2025-001',
    description: 'External reference (invoice number, etc.)',
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({
    example: '2025-03-01',
    description: 'Transaction date (YYYY-MM-DD). Defaults to today.',
  })
  @IsOptional()
  @IsDateString()
  date?: string;
}
