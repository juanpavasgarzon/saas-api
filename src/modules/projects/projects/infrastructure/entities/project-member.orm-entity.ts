import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

import { ProjectMemberRole } from '../../domain/enums/project-member-role.enum';
import { ProjectOrmEntity } from './project.orm-entity';

@Entity('project_members')
export class ProjectMemberOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  projectId!: string;

  @Column({ type: 'uuid' })
  tenantId!: string;

  @Column({ type: 'uuid' })
  employeeId!: string;

  @Column({
    type: 'enum',
    enum: ProjectMemberRole,
    default: ProjectMemberRole.MEMBER,
  })
  role!: ProjectMemberRole;

  @CreateDateColumn()
  joinedAt!: Date;

  @ManyToOne(() => ProjectOrmEntity, (project) => project.members, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project!: ProjectOrmEntity;
}
