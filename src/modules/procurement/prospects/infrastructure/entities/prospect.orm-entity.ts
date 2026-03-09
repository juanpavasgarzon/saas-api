import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { VendorProspectStatus } from '../../domain/enums/prospect-status.enum';

@Entity('vendor_prospects')
export class ProspectOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_vendor_prospects_tenant')
  tenantId!: string;

  @Column()
  name!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  email!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  phone!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  company!: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  notes!: string | null;

  @Column({
    type: 'enum',
    enum: VendorProspectStatus,
    enumName: 'vendor_prospect_status_enum',
    default: VendorProspectStatus.NEW,
  })
  status!: VendorProspectStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
