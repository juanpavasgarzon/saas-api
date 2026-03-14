import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('suppliers')
export class SupplierOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_suppliers_tenant')
  tenantId!: string;

  @Column()
  name!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  company!: string | null;

  @Column({ default: '' })
  identificationNumber!: string;

  @Column()
  email!: string;

  @Column({ default: '' })
  phone!: string;

  @Column({ default: '' })
  address!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  contactPerson!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
