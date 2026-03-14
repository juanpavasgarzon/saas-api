import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

import { InvoiceStatus } from '../../domain/enums/invoice-status.enum';
import { InvoiceItemOrmEntity } from './invoice-item.orm-entity';

@Entity('invoices')
export class InvoiceOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_invoices_tenant')
  tenantId!: string;

  @Column({ type: 'integer' })
  number!: number;

  @Column({ type: 'uuid' })
  dealId!: string;

  @Column({ type: 'uuid' })
  customerId!: string;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.DRAFT })
  @Index('IDX_invoices_tenant_status')
  status!: InvoiceStatus;

  @Column({ type: 'text', nullable: true, default: null })
  notes!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @Column({ type: 'timestamp', nullable: true, default: null })
  sentAt!: Date | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  paidAt!: Date | null;

  @OneToMany(() => InvoiceItemOrmEntity, (i) => i.invoice, { cascade: true, eager: true })
  items!: InvoiceItemOrmEntity[];

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  updatedAt!: Date;
}
