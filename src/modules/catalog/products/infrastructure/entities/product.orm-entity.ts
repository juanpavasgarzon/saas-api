import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
@Index('IDX_products_tenant_isActive', ['tenantId', 'isActive'])
@Unique('UQ_products_tenant_sku', ['tenantId', 'sku'])
export class ProductOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  @Index('IDX_products_tenant')
  tenantId!: string;

  @Column()
  name!: string;

  @Column()
  sku!: string;

  @Column({ nullable: true, type: 'varchar' })
  description!: string | null;

  @Column()
  unit!: string;

  @Column({ nullable: true, type: 'varchar' })
  category!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
