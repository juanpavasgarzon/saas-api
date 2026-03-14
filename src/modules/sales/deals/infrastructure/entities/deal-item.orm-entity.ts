import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';

import { DealOrmEntity } from './deal.orm-entity';

@Entity('deal_items')
export class DealItemOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_deal_items_sale')
  dealId!: string;

  @ManyToOne(() => DealOrmEntity, (s) => s.items, { onDelete: 'CASCADE' })
  sale!: DealOrmEntity;

  @Column({ type: 'enum', enum: LineItemType })
  itemType!: LineItemType;

  @Column({ type: 'uuid' })
  itemId!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  quantity!: number;

  @Column({ type: 'enum', enum: UnitOfMeasure, default: UnitOfMeasure.UNIT })
  unit!: UnitOfMeasure;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  lineTotal!: number;
}
