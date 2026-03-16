import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('services')
@Index('IDX_services_tenant_isActive', ['tenantId', 'isActive'])
export class ServiceOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  @Index('IDX_services_tenant')
  tenantId!: string;

  @Column()
  name!: string;

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
