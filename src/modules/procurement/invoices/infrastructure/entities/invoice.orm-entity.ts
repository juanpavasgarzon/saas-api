import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

import { InvoiceStatus } from '../../domain/enums/invoice-status.enum';

@Entity('supplier_invoices')
@Index('IDX_supplier_invoices_tenant_status', ['tenantId', 'status'])
export class InvoiceOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_supplier_invoices_tenant')
  tenantId!: string;

  @Column({ type: 'int' })
  number!: number;

  @Column()
  invoiceNumber!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_supplier_invoices_supplier')
  supplierId!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_supplier_invoices_po')
  orderId!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'date', nullable: true })
  dueDate!: Date | null;

  @Column({ type: 'enum', enum: InvoiceStatus, default: InvoiceStatus.PENDING })
  status!: InvoiceStatus;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  paidAt!: Date | null;

  @Column({ type: 'timestamp', default: () => 'now()' })
  createdAt!: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updatedAt!: Date;
}
