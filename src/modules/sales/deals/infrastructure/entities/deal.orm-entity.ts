import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

import { DealStatus } from '../../domain/enums/deal-status.enum';
import { DealItemOrmEntity } from './deal-item.orm-entity';

@Entity('sales')
export class DealOrmEntity {
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

  @Column({ type: 'enum', enum: DealStatus, default: DealStatus.PENDING })
  @Index('IDX_sales_tenant_status')
  status!: DealStatus;

  @Column({ type: 'text', nullable: true, default: null })
  notes!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @OneToMany(() => DealItemOrmEntity, (i) => i.sale, { cascade: true, eager: true })
  items!: DealItemOrmEntity[];

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  updatedAt!: Date;
}
