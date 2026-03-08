import { Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

import { MovementType } from '../../domain/enums/movement-type.enum';

@Entity('inventory_movements')
@Index('IDX_inventory_movements_tenant', ['tenantId'])
@Index('IDX_inventory_movements_tenant_product', ['tenantId', 'productId'])
export class MovementOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  productId!: string;

  @Column({ type: 'uuid', nullable: true })
  warehouseId!: string | null;

  @Column({
    type: 'enum',
    enum: MovementType,
    enumName: 'inventory_movement_type_enum',
  })
  type!: MovementType;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  quantity!: number;

  @Column({ type: 'varchar', nullable: true })
  referenceId!: string | null;

  @Column({ type: 'varchar', nullable: true })
  notes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
