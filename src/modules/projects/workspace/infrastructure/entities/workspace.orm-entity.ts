import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { WorkspaceStatus } from '../../domain/enums/workspace-status.enum';
import { WorkspaceMemberOrmEntity } from './workspace-member.orm-entity';

@Entity('workspaces')
@Index('IDX_workspaces_tenant_status', ['tenantId', 'status'])
@Index('IDX_workspaces_tenant_customer', ['tenantId', 'customerId'])
export class WorkspaceOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_workspaces_tenant')
  tenantId!: string;

  @Column()
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column('uuid')
  customerId!: string;

  @Column({
    type: 'enum',
    enum: WorkspaceStatus,
    default: WorkspaceStatus.PLANNING,
  })
  status!: WorkspaceStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget!: number | null;

  @Column({ type: 'date', nullable: true })
  startDate!: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => WorkspaceMemberOrmEntity, (member) => member.project, {
    cascade: true,
  })
  members!: WorkspaceMemberOrmEntity[];
}
