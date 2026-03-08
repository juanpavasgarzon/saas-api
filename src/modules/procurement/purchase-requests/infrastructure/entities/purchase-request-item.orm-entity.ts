import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { PurchaseRequestOrmEntity } from './purchase-request.orm-entity';

@Entity('purchase_request_items')
export class PurchaseRequestItemOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  purchaseRequestId!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  lineTotal!: number;

  @ManyToOne(() => PurchaseRequestOrmEntity, (pr) => pr.items, { onDelete: 'CASCADE' })
  purchaseRequest!: PurchaseRequestOrmEntity;
}
