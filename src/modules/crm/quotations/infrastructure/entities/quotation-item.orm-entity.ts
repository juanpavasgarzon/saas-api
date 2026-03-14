import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';

import { QuotationOrmEntity } from './quotation.orm-entity';

@Entity('quotation_items')
export class QuotationItemOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_quotation_items_quotation')
  quotationId!: string;

  @ManyToOne(() => QuotationOrmEntity, (q) => q.items, { onDelete: 'CASCADE' })
  quotation!: QuotationOrmEntity;

  @Column({ type: 'enum', enum: LineItemType })
  itemType!: LineItemType;

  @Column({ type: 'uuid' })
  itemId!: string;

  @Column()
  description!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  quantity!: number;

  @Column({
    type: 'enum',
    enum: UnitOfMeasure,
    default: UnitOfMeasure.UNIT,
  })
  unit!: UnitOfMeasure;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  unitPrice!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  lineTotal!: number;
}
