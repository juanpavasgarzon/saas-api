import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

import { SaleStatus } from '../../domain/enums/sale-status.enum';
import { SaleItemOrmEntity } from './sale-item.orm-entity';

@Entity('sales')
export class SaleOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_sales_tenant')
  tenantId!: string;

  @Column({ type: 'integer' })
  number!: number;

  @Column({ type: 'uuid' })
  customerId!: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  quotationId!: string | null;

  @Column({ type: 'enum', enum: SaleStatus, default: SaleStatus.PENDING })
  @Index('IDX_sales_tenant_status')
  status!: SaleStatus;

  @Column({ type: 'text', nullable: true, default: null })
  notes!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @OneToMany(() => SaleItemOrmEntity, (i) => i.sale, { cascade: true, eager: true })
  items!: SaleItemOrmEntity[];

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  updatedAt!: Date;
}
