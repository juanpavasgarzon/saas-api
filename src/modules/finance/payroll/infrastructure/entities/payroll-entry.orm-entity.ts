import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { PayrollStatus } from '../../domain/enums/payroll-status.enum';

@Entity('payroll_entries')
export class PayrollEntryOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  tenantId!: string;

  @Column({ type: 'uuid' })
  @Index()
  employeeId!: string;

  @Column({ length: 7 })
  period!: string;

  @Column({ type: 'int', default: 0 })
  daysWorked!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  baseSalary!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  bonuses!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  deductions!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  netPay!: number;

  @Column({
    type: 'enum',
    enum: PayrollStatus,
    default: PayrollStatus.PENDING,
  })
  status!: PayrollStatus;

  @Column({ type: 'timestamp', nullable: true })
  paidAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
