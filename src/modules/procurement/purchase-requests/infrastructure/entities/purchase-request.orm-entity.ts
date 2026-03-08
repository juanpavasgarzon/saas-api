import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PurchaseRequestStatus } from '../../domain/enums/purchase-request-status.enum';
import { PurchaseRequestItemOrmEntity } from './purchase-request-item.orm-entity';

@Entity('purchase_requests')
@Index('IDX_purchase_requests_tenant_status', ['tenantId', 'status'])
export class PurchaseRequestOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_purchase_requests_tenant')
  tenantId!: string;

  @Column()
  title!: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  vendorId!: string | null;

  @Column({ type: 'uuid', nullable: true, default: null })
  vendorProspectId!: string | null;

  @Column({ type: 'enum', enum: PurchaseRequestStatus, default: PurchaseRequestStatus.DRAFT })
  status!: PurchaseRequestStatus;

  @Column({ type: 'text', nullable: true, default: null })
  notes!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @OneToMany(() => PurchaseRequestItemOrmEntity, (item) => item.purchaseRequest, {
    cascade: true,
    eager: true,
  })
  items!: PurchaseRequestItemOrmEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
