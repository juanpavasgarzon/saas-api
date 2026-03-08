import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('vendors')
export class VendorOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_vendors_tenant')
  tenantId!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ default: '' })
  phone!: string;

  @Column({ default: '' })
  address!: string;

  @Column({ default: '' })
  contactPerson!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
