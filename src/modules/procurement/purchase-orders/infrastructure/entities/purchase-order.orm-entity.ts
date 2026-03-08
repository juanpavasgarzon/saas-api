import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { PurchaseOrderStatus } from '../../domain/enums/purchase-order-status.enum';
import { PurchaseOrderItemOrmEntity } from './purchase-order-item.orm-entity';

@Entity('purchase_orders')
@Index('IDX_purchase_orders_tenant_status', ['tenantId', 'status'])
export class PurchaseOrderOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_purchase_orders_tenant')
  tenantId!: string;

  @Column({ type: 'uuid' })
  purchaseRequestId!: string;

  @Column({ type: 'uuid' })
  vendorId!: string;

  @Column({ type: 'enum', enum: PurchaseOrderStatus, default: PurchaseOrderStatus.PENDING })
  status!: PurchaseOrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @OneToMany(() => PurchaseOrderItemOrmEntity, (item) => item.purchaseOrder, {
    cascade: true,
    eager: true,
  })
  items!: PurchaseOrderItemOrmEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
