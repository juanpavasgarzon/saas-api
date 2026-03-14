import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { OrderStatus } from '../../domain/enums/order-status.enum';
import { OrderItemOrmEntity } from './order-item.orm-entity';

@Entity('orders')
@Index('IDX_orders_tenant_status', ['tenantId', 'status'])
export class OrderOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_orders_tenant')
  tenantId!: string;

  @Column({ type: 'uuid' })
  requisitionId!: string;

  @Column({ type: 'uuid' })
  supplierId!: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @OneToMany(() => OrderItemOrmEntity, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items!: OrderItemOrmEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
