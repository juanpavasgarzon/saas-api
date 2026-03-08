import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';

import { InvoiceOrmEntity } from './invoice.orm-entity';

@Entity('invoice_items')
export class InvoiceItemOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_invoice_items_invoice')
  invoiceId!: string;

  @ManyToOne(() => InvoiceOrmEntity, (inv) => inv.items, { onDelete: 'CASCADE' })
  invoice!: InvoiceOrmEntity;

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
