import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { TransactionType } from '../../domain/enums/transaction-type.enum';

@Entity('accounting_transactions')
export class AccountingTransactionOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'enum', enum: TransactionType })
  type!: TransactionType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'varchar', nullable: true })
  reference!: string | null;

  @Column({ type: 'date' })
  date!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
