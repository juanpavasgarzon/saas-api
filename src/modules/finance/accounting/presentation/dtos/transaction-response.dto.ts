import { ApiProperty } from '@nestjs/swagger';

import { type AccountingTransaction } from '../../domain/entities/accounting-transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';

export class TransactionResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ enum: TransactionType, example: TransactionType.INCOME })
  type: TransactionType;

  @ApiProperty({ example: 5000 })
  amount: number;

  @ApiProperty({ example: 'Monthly retainer payment' })
  description: string;

  @ApiProperty({ example: 'INV-2025-001', nullable: true })
  reference: string | null;

  @ApiProperty({ example: '2025-03-01T00:00:00.000Z' })
  date: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(transaction: AccountingTransaction) {
    this.id = transaction.id;
    this.type = transaction.type;
    this.amount = transaction.amount;
    this.description = transaction.description;
    this.reference = transaction.reference;
    this.date = transaction.date;
    this.createdAt = transaction.createdAt;
    this.updatedAt = transaction.updatedAt;
  }
}
