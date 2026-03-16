import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('stock')
@Index('IDX_stock_tenant', ['tenantId'])
@Unique('UQ_stock_tenant_product_warehouse', ['tenantId', 'productId', 'warehouseId'])
export class StockOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'uuid' })
  warehouseId!: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  quantity!: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, default: 0 })
  reservedQuantity!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
