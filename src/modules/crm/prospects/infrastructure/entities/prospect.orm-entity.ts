import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { ProspectSource } from '../../domain/enums/prospect-source.enum';
import { ProspectStatus } from '../../domain/enums/prospect-status.enum';

@Entity('customer_prospects')
@Index('IDX_customer_prospects_tenant_status', ['tenantId', 'status'])
export class ProspectOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_prospects_tenant')
  tenantId!: string;

  @Column()
  name!: string;

  @Column({ type: 'varchar', nullable: true, default: null })
  email!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  phone!: string | null;

  @Column({ type: 'varchar', nullable: true, default: null })
  company!: string | null;

  @Column({ type: 'enum', enum: ProspectSource, nullable: true, default: null })
  source!: ProspectSource | null;

  @Column({ type: 'enum', enum: ProspectStatus, default: ProspectStatus.NEW })
  status!: ProspectStatus;

  @Column({ type: 'text', nullable: true, default: null })
  notes!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
