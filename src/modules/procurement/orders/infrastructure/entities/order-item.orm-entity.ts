import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';

import { OrderOrmEntity } from './order.orm-entity';

@Entity('order_items')
export class OrderItemOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  orderId!: string;

  @Column({ type: 'enum', enum: LineItemType })
  itemType!: LineItemType;

  @Column({ type: 'uuid' })
  itemId!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  lineTotal!: number;

  @ManyToOne(() => OrderOrmEntity, (po) => po.items, { onDelete: 'CASCADE' })
  order!: OrderOrmEntity;
}
