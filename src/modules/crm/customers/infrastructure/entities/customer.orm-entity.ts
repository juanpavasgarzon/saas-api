import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customers')
@Index('IDX_customers_tenant_isActive', ['tenantId', 'isActive'])
@Unique('UQ_customers_tenant_email', ['tenantId', 'email'])
export class CustomerOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_customers_tenant')
  tenantId!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone!: string;

  @Column()
  address!: string;

  @Column()
  contactPerson!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
