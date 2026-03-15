import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { WorkspaceMemberRole } from '../../domain/enums/workspace-member-role.enum';
import { WorkspaceOrmEntity } from './workspace.orm-entity';

@Entity('workspace_members')
export class WorkspaceMemberOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  workspaceId!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  employeeId!: string;

  @Column({
    type: 'enum',
    enum: WorkspaceMemberRole,
    default: WorkspaceMemberRole.MEMBER,
  })
  role!: WorkspaceMemberRole;

  @CreateDateColumn()
  joinedAt!: Date;

  @ManyToOne(() => WorkspaceOrmEntity, (workspace) => workspace.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'workspaceId' })
  workspace!: WorkspaceOrmEntity;
}
