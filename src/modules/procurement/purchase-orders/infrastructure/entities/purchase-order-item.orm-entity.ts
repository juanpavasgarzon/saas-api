import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { PurchaseOrderOrmEntity } from './purchase-order.orm-entity';

@Entity('purchase_order_items')
export class PurchaseOrderItemOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  purchaseOrderId!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  lineTotal!: number;

  @ManyToOne(() => PurchaseOrderOrmEntity, (po) => po.items, { onDelete: 'CASCADE' })
  purchaseOrder!: PurchaseOrderOrmEntity;
}
