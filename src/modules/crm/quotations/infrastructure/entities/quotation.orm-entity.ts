import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { QuotationStatus } from '../../domain/enums/quotation-status.enum';
import { QuotationItemOrmEntity } from './quotation-item.orm-entity';

@Entity('quotations')
@Index('IDX_quotations_tenant_status', ['tenantId', 'status'])
export class QuotationOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_quotations_tenant')
  tenantId!: string;

  @Column({ type: 'int' })
  number!: number;

  @Column()
  title!: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  customerId!: string | null;

  @Column({ type: 'uuid', nullable: true, default: null })
  prospectId!: string | null;

  @Column({ type: 'enum', enum: QuotationStatus, default: QuotationStatus.DRAFT })
  status!: QuotationStatus;

  @Column({ type: 'text', nullable: true, default: null })
  notes!: string | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  validUntil!: Date | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @OneToMany(() => QuotationItemOrmEntity, (item) => item.quotation, {
    cascade: true,
    eager: true,
  })
  items!: QuotationItemOrmEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
