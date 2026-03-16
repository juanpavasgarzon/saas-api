import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('warehouses')
@Index('IDX_warehouses_tenant_isActive', ['tenantId', 'isActive'])
export class WarehouseOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  @Index('IDX_warehouses_tenant')
  tenantId!: string;

  @Column()
  name!: string;

  @Column({ nullable: true, type: 'varchar' })
  location!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
