import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

import { SaleOrmEntity } from './sale.orm-entity';

@Entity('sale_items')
export class SaleItemOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_sale_items_sale')
  saleId!: string;

  @ManyToOne(() => SaleOrmEntity, (s) => s.items, { onDelete: 'CASCADE' })
  sale!: SaleOrmEntity;

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
